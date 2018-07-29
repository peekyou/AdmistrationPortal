import 'rxjs/add/operator/switchMap';
import { Component, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Address } from '../address/address';
import { Customer } from '../../../../components/customer/customer';
import { CustomerService } from '../../../../components/customer/customer.service';
import { CustomerNewModal } from '../../../../components/customer/customer-new/customer-new.modal';
import { UserService } from '../../../../components/user/user.service';
import { PagingResponse } from '../../../models/paging';

@Component({
    selector: 'app-customer-table',
    styleUrls: ['./customer-table.component.scss'],
    templateUrl: './customer-table.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CustomerTableComponent {
    loading = false;
    searchTerm: string;
    currentPage: number = 1;
    private _customers: PagingResponse<Customer> | Customer[];
    
    @Input() title: string;
    @Input() small: boolean;
    @Input() itemsPerPage: number = 10;
    @Output() onPageChanged: EventEmitter<number> = new EventEmitter();
    
    @Input() 
    set customers(customers: PagingResponse<Customer> | Customer[]) {
        this._customers = customers;
    }

    get customers(): PagingResponse<Customer> | Customer[] {
        return this._customers;
    }
        
    constructor(
        private fb: FormBuilder, 
        private route: ActivatedRoute, 
        private router: Router, 
        private service: CustomerService,
        private user: UserService,
        private modalService: NgbModal) {
    }
        
    openNewCustomerModal() {
        const modalRef = this.modalService.open(CustomerNewModal, { 
            // size: 'lg', 
            windowClass: 'customer-modal',
            // container: 'test'
        });

        modalRef.result.then((result) => {
            if (result === 'Y') {
            }
        }, (reason) => { });
    }

    selectCustomer(customer: Customer) {
        // Call get by id before going to detail page, to avoid two loading
        this.service.getById(customer.id)
                    .subscribe(c => {
                        this.service.customerSearched = c;
                        this.loading = false;
                        this.router.navigate(['/customers', customer.id]);
                    },
                    err => {
                        this.loading = false;
                    });
    }

    pageChanged(page) {
        this.currentPage = page;
        this.onPageChanged.emit(this.currentPage);
    }

    showArea() {
        return Address.showArea(this.user.getCountryCode().toLocaleLowerCase());
    }

    anyCustomer(): boolean {
        if ((<PagingResponse<Customer>>this._customers).paging) {
            return (<PagingResponse<Customer>>this._customers).paging.totalCount > 0;
        }
        else {
            return (<Customer[]>this._customers).length > 0;
        }
    }

    showPagination(): boolean {
        return (<PagingResponse<Customer>>this._customers).paging != null;
    }
}