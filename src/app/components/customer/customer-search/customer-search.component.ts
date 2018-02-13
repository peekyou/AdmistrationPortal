import 'rxjs/add/operator/switchMap';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

@Component({
    selector: 'customer-search',
    styleUrls: ['./customer-search.component.scss'],
    templateUrl: './customer-search.component.html'
})
export class CustomerSearchComponent {
    loading = false;
    searchTerm: string;
    customers: Customer[];
    form: FormGroup;
        
    constructor(
        private fb: FormBuilder, 
        private route: ActivatedRoute, 
        private router: Router, 
        private service: CustomerService) {
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
        this.customers = [];
        this.loading = true;
        if (this.searchTerm) {
            this.service
                .find(this.searchTerm.toLowerCase())
                .subscribe(customers => {
                    if (customers.length === 0) {
                        this.loading = false;
                        this.service.searchTerm = this.searchTerm;
                        this.router.navigate(['/customers/new']);
                    }
                    else if (customers.length === 1) {
                        this.selectCustomer(customers[0]);
                    }
                    else {
                        this.loading = false;
                        this.customers = customers;
                    }
                },
                err => { 
                    this.loading = false;
                    console.log(err); 
                }
            );
        }
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