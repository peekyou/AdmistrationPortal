import 'rxjs/add/operator/switchMap';
import { Component,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { CustomerNewModal } from '../customer-new/customer-new.modal';

@Component({
    selector: 'customer-search',
    styleUrls: ['./customer-search.component.scss'],
    templateUrl: './customer-search.component.html'
})
export class CustomerSearchComponent {
    loading = false;
    searchTerm: string;
    form: FormGroup;
    @Output() onSearch: EventEmitter<any> = new EventEmitter();
        
    constructor(
        private fb: FormBuilder, 
        private route: ActivatedRoute, 
        private router: Router, 
        private service: CustomerService,
        private modalService: NgbModal) {
        this.init();
    }
        
    init() {
        this.form = this.fb.group({
            firstname: [null, Validators.required],
            lastname: [null, Validators.required],
            mobile: [null, Validators.required],
            receiveSms: [],
            amount: [null, Validators.required]
        });
    }

    searchCustomer() {
        if (this.searchTerm) {
            this.loading = true;
            this.service
                .get(null, null, this.searchTerm.toLowerCase())
                .subscribe(customers => {
                    if (customers.paging.totalCount === 0) {
                        this.loading = false;
                        this.service.searchTerm = this.searchTerm;
                        this.openNewCustomerModal();
                    }
                    else if (customers.paging.totalCount === 1) {
                        this.selectCustomer(customers.data[0]);
                    }
                    else {
                        this.loading = false;
                        this.onSearch.emit(customers);
                    }
                },
                err => { 
                    this.loading = false;
                    console.log(err); 
                }
            );
        }
        else {
            this.openNewCustomerModal();
        }
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
    
    get firstname() { return this.form.get('firstname'); }
    get lastname() { return this.form.get('lastname'); }
    get amount() { return this.form.get('amount'); }
    get mobile() { return this.form.get('mobile'); }
}