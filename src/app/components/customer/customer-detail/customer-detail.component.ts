import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { Customer, CustomerPoint } from '../customer';
import { CustomerService } from '../customer.service';
import { DeleteModal } from '../../../core/shared/modals/delete.modal';

@Component({
    styleUrls: ['./customer-detail.component.scss'],
    templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {
    customer: Customer = null;
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
            .switchMap((params: ParamMap) => this.service.getById(params.get('id')))
            .subscribe(customer => {
                this.customer = customer;
                this.customer.purchaseData = this.service.calculatePurchaseData(customer.points);
            });
    }
    
    saveEntry(): void {
        this.saveEntrySubscription = this.service
            .saveEntry(this.customer.id, this.newEntryAmount)
            .subscribe(
                r => {
                    this.customer = r;
                    this.customer.purchaseData = this.service.calculatePurchaseData(this.customer.points);
                    //if (!this.customer.points) {
                    //    this.customer.points = [];
                    //}
                    //if (r.length > 0) {
                    //    this.customer.lastEntry = r[0].date;
                    //    r.forEach(p => {
                    //        this.customer.points.push(p);
                    //        this.customer.currentPoints += p.correspondingAmount;
                    //        this.customer.totalPoints += p.correspondingAmount;
                    //    });
                    //    this.customer.purchaseData = this.service.calculatePurchaseData(this.customer.points);
                    //}
                },
                err => { console.log(err); }
            );
    }

    saveCustomer() {
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