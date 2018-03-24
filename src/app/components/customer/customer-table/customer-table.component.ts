import 'rxjs/add/operator/switchMap';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { CustomerNewModal } from '../customer-new/customer-new.modal';
import { PagingResponse } from '../../../core/models/paging';

@Component({
    selector: 'customer-table',
    styleUrls: ['./customer-table.component.scss'],
    templateUrl: './customer-table.component.html'
})
export class CustomerTableComponent {
    loading = false;
    searchTerm: string;
    
    private _customers: PagingResponse<Customer>;
    
    @Input() 
    set customers(customers: PagingResponse<Customer>) {
        this._customers = customers;
    }

    get customers(): PagingResponse<Customer> {
        return this._customers;
    }
        
    constructor(
        private fb: FormBuilder, 
        private route: ActivatedRoute, 
        private router: Router, 
        private service: CustomerService,
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
                        console.log(c);
                        this.service.customerSearched = c;
                        this.loading = false;
                        this.router.navigate(['/customers', customer.id]);
                    },
                    err => {
                        this.loading = false;
                    });
    }
}