import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Customer } from '../../customer';
import { CustomerService } from '../../customer.service';
import { CustomerDetailService } from '../customer-detail.service';
import { NotificationService } from '../../../../core/shared/components/notifcations/notification.service';

@Component({
    selector: 'app-customer-expenses',
    styleUrls: ['./expenses.component.scss'],
    templateUrl: './expenses.component.html'
})
export class CustomerExpensesComponent {
    getExpensesSubscription: Subscription;

    constructor(
        private service: CustomerService,
        private notifications: NotificationService,
        public c: CustomerDetailService) {
    }

    getExpenses(searchFilter) {
        this.getExpensesSubscription = this.service
            .getExpenses(this.c.customer.id, searchFilter.from, searchFilter.to)
            .subscribe(
                res => { this.c.customer.expenses = res },
                err => { 
                    console.log(err);
                    this.notifications.setErrorNotification();
                }
            );
    }
}