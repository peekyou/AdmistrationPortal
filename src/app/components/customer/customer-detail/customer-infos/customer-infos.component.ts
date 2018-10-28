import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Customer } from '../../customer';
import { CustomerService } from '../../customer.service';
import { CustomerDetailService } from '../customer-detail.service';
import { dateToNgbDateStruct } from '../../../../core/helpers/utils';
import { NotificationService } from '../../../../core/shared/components/notifcations/notification.service';
import { CustomerCustomFields } from '../../../../core/models/customerCustomFields';

@Component({
    selector: 'app-customer-infos',
    styleUrls: ['./customer-infos.component.scss'],
    templateUrl: './customer-infos.component.html'
})
export class CustomerInfosComponent {
    customerForm: FormGroup;
    saveSubscription: Subscription;

    constructor(
        private service: CustomerService,
        private notifications: NotificationService,
        public c: CustomerDetailService) {
    }
    
    saveCustomer(customer: Customer) {
        // Merge the data coming from the form to the current customer
        customer.id = this.c.customer.id;
        this.saveSubscription = this.service
            .update(customer)
            .subscribe(
                customer => this.c.customer = customer,
                err => { 
                    var e = err.error && err.error.errorCode ? err.error.errorCode : null;
                    this.notifications.setErrorNotification(e);
                 }
        );
    }
}