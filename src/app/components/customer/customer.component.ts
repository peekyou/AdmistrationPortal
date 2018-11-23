import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CustomerService } from './customer.service';
import { CustomerScanModal } from './customer-scan/customer-scan.modal';
import { UserManagementService } from '../user-management/user-management.service';
import { CustomerDetailService } from './customer-detail/customer-detail.service';
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

    constructor(private service: CustomerService, private modalService: NgbModal, c: CustomerDetailService) { 
        c.customer = null;
        service.searchTerm = null;
    }

    public ngOnInit() {
        this.loading = true;
        this.service.getCount()
            .subscribe(c => {
                this.customersCount = c;
                this.loading = false;
            });
    }
    
    public updateCustomers(customers: PagingResponse<Customer>) {
        this.customers = customers;
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