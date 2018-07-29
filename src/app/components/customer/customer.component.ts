import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CustomerService } from './customer.service';
import { CustomerScanModal } from './customer-scan/customer-scan.modal';
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
    loadingCustomers = false;

    constructor(private service: CustomerService, private modalService: NgbModal) { }

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
        this.loadingCustomers = true;
        this.service.get(page, this.itemsPerPage)
            .subscribe(customers => {
                this.loadingCustomers = false;
                this.customers = customers;
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