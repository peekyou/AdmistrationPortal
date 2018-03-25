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
    loading = false;

    constructor(private service: CustomerService) { }

    public ngOnInit() {
        this.loading = true;
        this.service.getCount()
            .subscribe(c => {
                this.customersCount = c;
                this.loading = false;
            });

        
        this.service.get(null, null)
            .subscribe(customers => {
                this.customers = customers;
            });
    }
    
    public updateCustomers(customers: PagingResponse<Customer>) {
        this.customers = customers;
    }
}