import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import * as moment from 'moment';

import { Customer, CustomerExpense } from '../../customer';
import { CustomerService } from '../../customer.service';
import { CustomerDetailService } from '../customer-detail.service';
import { UserService } from '../../../user/user.service';
import { LoyaltyProgramBirthday, LoyaltyProgramPoints, LoyaltyProgramBuyGetFree } from '../../../../core/models/loyaltyPrograms';
import { NotificationService } from '../../../../core/shared/components/notifcations/notification.service';
import { TranslationService } from '../../../../core/services/translation.service';

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
    loading = false; 
    selectedReward;
    pointsLabel: string = 'Points';
    rewards;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: CustomerService,
        private modalService: NgbModal,
        private notifications: NotificationService,
        private translation: TranslationService,
        private user: UserService,
        public c: CustomerDetailService
    ) {
        this.currency = user.getCurrency();
        this.translation.get('COMMON.POINTS', x => this.pointsLabel = x);    
     }

    ngOnInit() {
    }

    saveEntry() {
        this.loading = true;
        this.saveEntrySubscription = this.service
            .saveExpense({
                customerId: this.c.customer.id,
                amount: this.newEntryAmount,
                date: new Date(),
                localDate: moment().format("DD-MM-YYYY HH:mm:ss Z"),
            })
            .subscribe(
                r => {
                    this.c.customer = r;
                    this.newEntryAmount = null;
                    this.loading = false;
                    this.c.customer.purchaseData = this.service.calculatePurchaseData(this.c.customer.points);
                },
                err => { 
                    console.log(err);
                    this.loading = false;
                    this.notifications.setErrorNotification();
                }
            );
    }

    giveDiscount() {
        this.giveDiscountSubscription = this.giveLoyatlyDiscount()
        .subscribe(
            r => {
                this.rewards = null;
                this.c.customer = r;
                this.c.customer.purchaseData = this.service.calculatePurchaseData(this.c.customer.points);
                this.getEligibleRewards();
            },
            err => { 
                console.log(err);
                this.notifications.setErrorNotification();
             }
        );
    }

    giveLoyatlyDiscount() : Observable<Customer> {
        return this.c.customer.isEligibleForDiscount ? 
            this.service.giveLoyaltyDiscount(this.c.customer.id, this.selectedReward.id, this.selectedReward.rewardId)
            :
            this.service.giveDiscount(this.c.customer.id)
    }

    sendApplicationSms() {
        this.sendSmsSubscription = this.service.sendApplicationSms(this.c.customer.id)
        .subscribe(
            res => { this.notifications.getApplicationSmsStatus(this.c.customer.mobileNumber, this.c.customer.firstname + ' ' + this.c.customer.lastname) },
            err => { console.log(err); }
        );
    }

    birthdayLoyaltyGift() {
        for (var i = 0; this.user.loyaltyPrograms && i < this.user.loyaltyPrograms.length; i++) {
            var program = this.user.loyaltyPrograms[i];
            if (program.$type.toLowerCase().indexOf('birthday') > -1) {
                var birthdate = moment(this.c.customer.birthdate);
                var today = moment();
                return birthdate.date() == today.date() && birthdate.month() == today.month() ? (<LoyaltyProgramBirthday>program).gift : null;
            }
        }
        return null;
    }

    getEligibleRewards() {
        if (this.rewards && this.rewards.length > 0) {
            return this.rewards;
        }

        for (var i = 0; this.user.loyaltyPrograms && i < this.user.loyaltyPrograms.length; i++) {
            if (!this.rewards) {
                this.rewards = [];
            }

            var program = this.user.loyaltyPrograms[i];
            if (program.$type.toLowerCase().indexOf('points') > -1) {
                (<LoyaltyProgramPoints>program).rewards.forEach(x => {
                    if (this.c.customer.currentPoints >= x.pointsThreshold) {
                        var pointsLabel = ' (' + x.pointsThreshold + ' ' + this.pointsLabel + ')';
                        this.rewards.push({
                            id: (<LoyaltyProgramPoints>program).id,
                            rewardId: x.id, 
                            name: x.reward ? x.reward + pointsLabel : x.amount + ' ' + this.currency + pointsLabel
                        });
                    }
                });
            }

            if (program.$type.toLowerCase().indexOf('buygetfree') > -1) {
                if (this.c.customer.currentPoints >= (<LoyaltyProgramBuyGetFree>program).threshold) {
                    var pointsLabel = ' (' + (<LoyaltyProgramBuyGetFree>program).threshold + ' ' + this.pointsLabel + ')';
                    this.rewards.push({
                        id: (<LoyaltyProgramBuyGetFree>program).id,
                        name: (<LoyaltyProgramBuyGetFree>program).productName + pointsLabel
                    });
                }
            }
        }
        
        if (this.rewards && this.rewards.length > 0) {
            this.selectedReward = this.rewards[0];
        }

        return this.rewards;
    }
}