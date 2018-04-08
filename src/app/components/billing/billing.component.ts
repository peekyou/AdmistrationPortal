import { Component } from '@angular/core';

import { UserService } from '../user/user.service';
import { BillingService } from './billing.service';
import { PagingResponse } from '../../core/models/paging';
import { Bill } from './bill';

@Component({
    styleUrls: ['./billing.component.scss'],
    templateUrl: './billing.component.html'
})
export class BillingComponent {
    loading = false;
    bills: PagingResponse<Bill>;
    currentPage: number = 1;
    itemsPerPage: number = 20;

    constructor(private service: BillingService, public user: UserService) { 
        this.getBillsPage();
    }

    getBillsPage() {
        this.loading = true;
        this.service.getBills(null, null)
            .subscribe(
                res => {
                    this.bills = res;
                    this.loading = false;
                },
                err => { console.log(err); }
            );
    }
}
