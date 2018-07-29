import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { Customer, CustomerExpense } from '../../customer';
import { CustomerService } from '../../customer.service';
import { CustomerDetailService } from '../customer-detail.service';
import { UserService } from '../../../user/user.service';
import { NotificationService } from '../../../../core/shared/components/notifcations/notification.service';

@Component({
    selector: 'app-customer-loyalty-card',
    styleUrls: ['./loyalty-card.component.scss'],
    templateUrl: './loyalty-card.component.html'
})
export class CustomerLoyaltyCardComponent implements OnInit {
    currency: string;
    newEntryAmount: number = null;
    useDiscountLater: boolean = false;
    saveEntrySubscription: Subscription;
    saveSubscription: Subscription;
    giveDiscountSubscription: Subscription;
    sendSmsSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: CustomerService,
        private modalService: NgbModal,
        private notifications: NotificationService,
        user: UserService,
        public c: CustomerDetailService
    ) {
        this.currency = user.getCurrency();        
     }

    ngOnInit() {
    }

    saveEntry() {
        this.saveEntrySubscription = this.service
            .saveEntry(this.c.customer.id, this.newEntryAmount)
            .subscribe(
                r => {
                    this.c.customer = r;
                    this.c.customer.purchaseData = this.service.calculatePurchaseData(this.c.customer.points);
                },
                err => { 
                    console.log(err);
                    this.notifications.setErrorNotification();
                }
            );
    }

    giveDiscount() {
        this.giveDiscountSubscription = this.service
        .giveDiscount(this.c.customer.id)
        .subscribe(
            r => {
                this.c.customer = r;
                this.c.customer.purchaseData = this.service.calculatePurchaseData(this.c.customer.points);
            },
            err => { 
                console.log(err);
                this.notifications.setErrorNotification();
             }
        );
    }

    sendApplicationSms() {
        this.sendSmsSubscription = this.service.sendApplicationSms(this.c.customer.id)
        .subscribe(
            res => { this.notifications.getApplicationSmsStatus(this.c.customer.mobileNumber, this.c.customer.firstname + ' ' + this.c.customer.lastname) },
            err => { console.log(err); }
        );
    }
}