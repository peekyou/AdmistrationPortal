import { Component, OnInit } from '@angular/core';
import { CustomerService } from './customer.service';
import { UserManagementService } from '../user-management/user-management.service';
import { Customer } from './customer';
import { PagingResponse } from '../../core/models/paging';

@Component({
    styleUrls: [ './customer.component.scss' ],
    templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
    customers: PagingResponse<Customer>;
    customersCount: number;
    itemsPerPage: number = 20;
    loading = false;

    constructor(private service: CustomerService) { }

    public ngOnInit() {
        this.loading = true;
        this.service.getCount()
            .subscribe(c => {
                this.customersCount = c;
                this.loading = false;
            });

        this.getCustomersPage(1);
    }
    
    public updateCustomers(customers: PagingResponse<Customer>) {
        this.customers = customers;
    }

    public getCustomersPage(page: number) {
        this.service.get(page, this.itemsPerPage)
            .subscribe(customers => {
                this.customers = customers;
            });
    }
}