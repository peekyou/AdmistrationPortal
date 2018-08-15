import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Customer } from '../customer';

@Injectable()

export class CustomerDetailService {
    private _customer: Customer;

    set customer(customer: Customer) {
        this._customer = customer;
    }
     
    get customer(): Customer {
        return this._customer;
    }

    constructor() { }
}

