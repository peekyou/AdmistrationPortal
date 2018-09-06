import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { UserService } from '../../user/user.service';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { CustomerDetailService } from './customer-detail.service';
import { CustomerLoyaltyCardComponent } from './loyalty-card/loyalty-card.component';

@Component({
    styleUrls: ['./customer-detail.component.scss'],
    templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {
    onCustomerChange: EventEmitter<Customer> = new EventEmitter();
    topLeftCardIndex: number;
    topRightCardIndex: number;
    bottomLeftCardIndex: number;
    bottomRightCardIndex: number;
    
    constructor(
        private route: ActivatedRoute,
        private user: UserService,
        private service: CustomerService,
        public c: CustomerDetailService) {
            
            this.topLeftCardIndex = user.getCustomerCardsOrder()[0];
            this.topRightCardIndex = user.getCustomerCardsOrder()[1];
            this.bottomLeftCardIndex = user.getCustomerCardsOrder()[2];
            this.bottomRightCardIndex = user.getCustomerCardsOrder()[3];
    }

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
                this.c.customer = customer;
                this.c.customer.purchaseData = this.service.calculatePurchaseData(customer.points);
            });
    }
}