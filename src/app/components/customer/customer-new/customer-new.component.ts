import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Customer, CustomerExpense } from '../customer';
import { CustomerService } from '../customer.service';

@Component({
    styleUrls: ['./customer-new.component.scss'],
    templateUrl: './customer-new.component.html'
})
export class CustomerNewComponent {
    saveSubscription: Subscription;
        
    constructor(private router: Router, private service: CustomerService) {
    }
    
    saveCustomer(customer: Customer) {
        this.saveSubscription = this.service
            .create(customer)
            .subscribe(
                id => this.router.navigate(['/customers', id]),
                err => { console.log(err); }
            );
    }

    populateSearch(form: FormGroup = null) {  
        if (this.isMobileNumber(this.service.searchTerm)) {          
            form.patchValue({
                mobile: this.service.searchTerm
            });
            this.service.searchTerm = null;
        }
    }

    isMobileNumber(searchTerm: string): boolean {
        if (searchTerm && (searchTerm.startsWith('+') || searchTerm.startsWith('0'))) {
            var cleaned = searchTerm.replace(/[\+_\-\s]/g, '');
            return /^[\d]+$/.test(cleaned);
        }
        return false;
    }
}