import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { Bill } from './bill';

@Injectable()

export class BillingService {
    private api = '/billing.json';
    customers: Bill[] = [];

    constructor(private http: AuthHttpService) {
    }
}

