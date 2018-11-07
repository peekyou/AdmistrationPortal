import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { CustomerScanModal } from '../customer-scan/customer-scan.modal';
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
    loading = false;
    
    constructor(
        private route: ActivatedRoute,
        private modalService: NgbModal,
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
                this.loading = true;
                return this.service.getById(params.get('id'));
            })
            .subscribe(customer => {
                this.loading = false;
                this.c.customer = customer;
                this.c.customer.purchaseData = this.service.calculatePurchaseData(customer.points);
            });
    }

    openScanner() {
        const modalRef = this.modalService.open(CustomerScanModal, { 
            // size: 'lg', 
            windowClass: 'customer-modal',
            // container: 'test'
        });

        modalRef.result.then((result) => {
            if (result === 'Y') {
            }
        }, (reason) => { });
    }
}