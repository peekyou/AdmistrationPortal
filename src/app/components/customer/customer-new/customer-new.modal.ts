import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { Customer, CustomerExpense } from '../customer';
import { CustomerService } from '../customer.service';
import { isMobileNumber } from '../../../core/helpers/utils';

@Component({
    styleUrls: ['./customer-new.modal.scss'],
    templateUrl: './customer-new.modal.html'
})
export class CustomerNewModal {
    error: boolean;
    saveSubscription: Subscription;    

    constructor(public activeModal: NgbActiveModal, private router: Router, private service: CustomerService) { }

    saveCustomer(customer: Customer) {
        this.saveSubscription = this.service
            .create(customer)
            .subscribe(
                id => {
                    this.activeModal.close();
                    this.router.navigate(['/customers', id]);
                },
                err => { 
                    this.error = true;
                    console.log(err); 
                }
            );
    }

    populateSearch(form: FormGroup = null) {  
        if (isMobileNumber(this.service.searchTerm)) {          
            form.patchValue({
                mobile: this.service.searchTerm
            });
            this.service.searchTerm = null;
        }
    }
 }