import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { Customer, CustomerExpense } from '../customer';
import { CustomerService } from '../customer.service';
import { NotificationService } from '../../../core/shared/components/notifcations/notification.service';
import { isMobileNumber } from '../../../core/helpers/utils';

@Component({
    styleUrls: ['./customer-new.modal.scss'],
    templateUrl: './customer-new.modal.html'
})
export class CustomerNewModal {
    error: boolean | string;
    saveSubscription: Subscription;    

    constructor(
        public activeModal: NgbActiveModal,
        private router: Router, 
        private service: CustomerService,
        private notifications: NotificationService) { }

    saveCustomer(customer: Customer) {
        this.saveSubscription = this.service
            .create(customer)
            .subscribe(
                id => {
                    if (id) {
                        this.notifications.getApplicationSmsStatus(customer.mobileNumber, customer.firstname + ' ' + customer.lastname);
                        this.activeModal.close();
                        this.router.navigate(['/customers', id]);
                    }
                },
                err => {
                    this.error = err.error && err.error.errorCode ? err.error.errorCode : true;
                }
            );
    }

    populateSearch(form: FormGroup = null) {  
        if (isMobileNumber(this.service.searchTerm)) {
            if (this.service.searchTerm.startsWith('0')) {
                this.service.searchTerm = this.service.searchTerm.removeAt(0);
            }
            form.patchValue({
                mobile: this.service.searchTerm
            });
        }
        this.service.searchTerm = null;
    }
 }