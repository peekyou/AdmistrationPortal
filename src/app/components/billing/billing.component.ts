import { Component } from '@angular/core';

import { UserService } from '../user/user.service';
import { BillingService } from './billing.service';
import { PagingResponse } from '../../core/models/paging';
import { Bill, GroupedBills } from './bill';
import * as moment from 'moment';

@Component({
    styleUrls: ['./billing.component.scss'],
    templateUrl: './billing.component.html'
})
export class BillingComponent {
    loading = false;
    groupedBills: GroupedBills[];
    currentPage: number = 1;
    itemsPerPage: number = 20;
    moment;

    constructor(private service: BillingService, public user: UserService) { 
        this.getBillsPage();
        this.moment = moment;
    }

    getBillsPage() {
        this.loading = true;
        this.service.getBills(null, null)
            .subscribe(
                res => {
                    this.groupedBills = this.groupBills(res);
                    this.loading = false;
                },
                err => { console.log(err); }
            );
    }

    download(id: string) { 
        this.service.downloadBill(id);
    }

    groupBills(bills: PagingResponse<Bill>): GroupedBills[] {
        var group: GroupedBills[] = [];
        if (bills && bills.paging.itemsCount > 0) {
            var current = bills.data[0];
            var currentMonthBills: Bill[] = [current];
            for (let i = 1; i < bills.data.length; i++) {
                var curr = new Date(current.createdDate);
                var date = new Date(bills.data[i].createdDate);
                if (date.getMonth() == curr.getMonth() &&
                    date.getFullYear() == curr.getFullYear()) {
                        currentMonthBills.push(bills.data[i]);
                }
                else {
                    group.push({date: current.createdDate, bills: currentMonthBills });
                    current = bills.data[i];
                    currentMonthBills = [current];
                }
            }
            group.push({date: current.createdDate, bills: currentMonthBills });
        }
        return group;
    }
}
