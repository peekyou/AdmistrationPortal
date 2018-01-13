import { Component, OnInit } from '@angular/core';
import { CustomerService } from './customer.service';
import { UserManagementService } from '../user-management/user-management.service';

@Component({
    styleUrls: [ './customer.component.scss' ],
    templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
    customersCount: number;

    constructor(private service: CustomerService)
    { }

    public ngOnInit() {
        this.service.getAllCount()
            .subscribe(c => {
                this.customersCount = c;
            });
    }
}
