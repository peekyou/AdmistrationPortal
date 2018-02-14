import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Customer, CustomerPoint } from '../customer';
import { CustomerService } from '../customer.service';
import { DeleteModal } from '../../../core/shared/modals/delete.modal';
import { dateToNgbDateStruct } from '../../../core/helpers/utils';

@Component({
    styleUrls: ['./customer-detail.component.scss'],
    templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {
    customer: Customer = null;
    customerForm: FormGroup;
    newEntryAmount: number = null;
    saveEntrySubscription: Subscription;
    saveSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private service: CustomerService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.route.paramMap
            .switchMap((params: ParamMap) => {
                if (this.service.customerSearched) {
                    var clone = Object.assign({}, this.service.customerSearched);   
                    this.service.customerSearched = null;                 
                    return Observable.of(clone);
                }
                return this.service.getById(params.get('id'));
            })
            .subscribe(customer => {
                this.customer = customer;
                this.customer.purchaseData = this.service.calculatePurchaseData(customer.points);
                this.populateUser();
            });
    }

    populateUser(form: FormGroup = null) {
        if (form) {
            this.customerForm = form;
        }
        if (this.customerForm) {                
            this.customerForm.patchValue({
                gender: this.customer.gender,
                firstname: this.customer.firstname,
                lastname: this.customer.lastname,
                mobile: this.customer.mobileNumber,
                email: this.customer.email,
                birthdate: dateToNgbDateStruct(this.customer.birthdate),
                languages: this.customer.languages, // Set first language
                comment: this.customer.comment
            });

            if (this.customer.address) {
                this.customerForm.patchValue({
                   address: {
                        address: this.customer.address.addressLine1,
                        city: this.customer.address.city,
                        area: this.customer.address.area,
                        zip: this.customer.address.zipCode,
                        state: this.customer.address.state
                    }
                });
            }

            // Set other languages
            const languagesControl = <FormArray>this.customerForm.controls['languages'];
            for (let i = 1; this.customer.languages && i < this.customer.languages.length; i++) {
                let newLanguage = new FormControl(this.customer.languages[i]);
                languagesControl.push(newLanguage);
            }
        }
    }
    
    saveEntry() {
        this.saveEntrySubscription = this.service
            .saveEntry(this.customer.id, this.newEntryAmount)
            .subscribe(
                r => {
                    this.customer = r;
                    this.customer.purchaseData = this.service.calculatePurchaseData(this.customer.points);
                },
                err => { console.log(err); }
            );
    }

    saveCustomer(customer: Customer) {
        // Merge the data coming from the form to the current customer
        Object.assign(this.customer, customer);
        this.saveSubscription = this.service
            .update(this.customer)
            .subscribe(
                id => { },
                err => { console.log(err); }
        );
    }

    openDeleteModal(point: CustomerPoint) {
        const modalRef = this.modalService.open(DeleteModal);
        modalRef.componentInstance.data = 'these points';

        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.deletePoints(point);
            }
        });
    }

    deletePoints(point: CustomerPoint) {
        this.service
            .deletePoints(point)
            .subscribe(
                r => {
                    var index = this.customer.points.indexOf(point);
                    if (index > -1) {
                        this.customer.points.splice(index, 1);
                        this.customer.points = this.customer.points.slice();
                        this.customer.purchaseData = this.service.calculatePurchaseData(this.customer.points);
                        this.customer.totalPoints -= r;
                        this.customer.currentPoints -= r;
                    }
                },
                err => { console.log(err); }
            );
    }
    
    goBack(): void {
        this.location.back();
    }
}