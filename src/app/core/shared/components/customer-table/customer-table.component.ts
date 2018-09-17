import 'rxjs/add/operator/switchMap';
import { Component, Input, Output, ViewEncapsulation, EventEmitter, OnInit } from '@angular/core';
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
import { TableSearch, FieldSort, FieldFilter, SortType } from '../../../models/tableSearch';

@Component({
    selector: 'app-customer-table',
    styleUrls: ['./customer-table.component.scss'],
    templateUrl: './customer-table.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CustomerTableComponent implements OnInit {
    loading = false;
    sortTypes: SortType[] = [SortType.None, SortType.None, SortType.None, SortType.None, SortType.None, SortType.None];  
    currentPage: number = 1;
    sorts: FieldSort[] = [];
    filters: FieldFilter[] = [];
    private _customers: PagingResponse<Customer> | Customer[];
    
    @Input() title: string;
    @Input() small: boolean;
    @Input() sortable: boolean;
    @Input() filterable: boolean;
    @Input() itemsPerPage: number;
    // @Output() onPageChanged: EventEmitter<number> = new EventEmitter();
    
    @Input() 
    set customers(customers: PagingResponse<Customer> | Customer[]) {
        if (customers) {
            this._customers = customers;
            if (this.showPagination()) {
                this.currentPage = (<PagingResponse<Customer>>this._customers).paging.pageNumber;
            }
        }
        else {
            this._customers = [];
        }
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

    ngOnInit() {
        if (!this.small) {
            this.getCustomersPage(this.currentPage);
        }
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
        this.getCustomersPage(page);
        // this.onPageChanged.emit(this.currentPage);
    }

    sort(index: number, fields: string[]) {
        if (!this.sortable) {
            return;
        }

        if (index < this.sortTypes.length) {
            this.sortTypes[index] = this.sortTypes[index] == SortType.Desc ? SortType.None : this.sortTypes[index] + 1;
        }

        // Reset other sort types
        for (let i = 0; i < this.sortTypes.length; i++) {
            if (i != index) {
                this.sortTypes[i] = SortType.None;
            }
        }
        
        this.sorts = [];
        fields.forEach(f => {
            if (this.sortTypes[index] != SortType.None) {
                var sort = this.sortTypes[index] == SortType.Asc ? 'ASC' : 'DESC';

                if (f == 'Address') {
                    f = this.showArea() ? 
                    'Addresses.FirstOrDefault(EndVersion == null).Address.Area'
                    :
                    'Addresses.FirstOrDefault(EndVersion == null).Address.City';
                }

                this.sorts.push({ sortType: sort, fieldName: f });
            }
        });

        this._customers = null;
        this.loading = true;
        window.scroll(0,0);
        this.service.get({
            pageNumber: this.currentPage,
            itemsCount: this.itemsPerPage,
            searchTerm: this.service.searchTerm,
            sorts: this.sorts
        })
        .subscribe(customers => {
            this.loading = false;
            this.customers = customers;
        });
    }

    getCustomersPage(page: number) {
        this._customers = null;
        this.loading = true;
        window.scroll(0,0);
        this.service.get({
            pageNumber: page,
            itemsCount: this.itemsPerPage,
            searchTerm: this.service.searchTerm,
            sorts: this.sorts
        })
        .subscribe(customers => {
            this.loading = false;
            this.customers = customers;
        });
    }

    showArea() {
        return Address.showArea(this.user.getCountryCode().toLocaleLowerCase());
    }

    anyCustomer(): boolean {
        if (!this._customers) {
            return false;
        }
        if ((<PagingResponse<Customer>>this._customers).paging) {
            return (<PagingResponse<Customer>>this._customers).paging.totalCount > 0;
        }
        else {
            return (<Customer[]>this._customers).length > 0;
        }
    }

    showPagination(): boolean {
        return this._customers && (<PagingResponse<Customer>>this._customers).paging != null;
    }
}