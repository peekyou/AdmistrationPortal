import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { Customer, CustomerExpense } from '../customer';
import { CustomerService } from '../customer.service';

@Component({
    styleUrls: ['./customer-new.component.scss'],
    templateUrl: './customer-new.component.html'
})
export class CustomerNewComponent {
    form: FormGroup;
    submitting = false;
        
    constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private service: CustomerService) {
        this.init();
    }
        
    init() {
        this.form = this.fb.group({
            firstname: [null, Validators.required],
            lastname: [null, Validators.required],
            mobile: [null, Validators.required],
            receiveSms: [true],
            amount: [null, Validators.required]
        });
    }
    
    saveCustomer() {
        this.submitting = true;
        var newCustomer: Customer = {
            expenses: [{ createdDate: new Date(), amount: this.form.value.amount }],
            mobileNumber: this.form.value.mobile,
            firstname: this.form.value.firstname,
            lastname: this.form.value.lastname
        };
        this.service
            .create(newCustomer)
            .subscribe(
                id => this.router.navigate(['/customers', id]),
                err => { console.log(err); this.submitting = false; }
            );
    }
    
    get firstname() { return this.form.get('firstname'); }
    get lastname() { return this.form.get('lastname'); }
    get amount() { return this.form.get('amount'); }
    get mobile() { return this.form.get('mobile'); }
}