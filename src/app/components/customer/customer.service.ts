import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { UserService } from '../user/user.service';
import { Customer, CustomerExpense, CustomerFilter, CustomerPoint, PurchaseData } from './customer';
import { PagingResponse } from '../../core/models/paging';
import { Lookup } from '../../core/models/lookup';

@Injectable()

export class CustomerService {
    private api: string;
    customerSearched: Customer;
    searchTerm: string;

    constructor(@Inject(APP_CONFIG) config: AppConfig, private http: AuthHttpService, private user: UserService) {
        this.api = config.ApiEndpoint + '/customers';
    }

    get(page: number, count: number, searchTerm: string = ''): Observable<PagingResponse<Customer>> {
        return this.http.get(this.api + '?pageNumber=' + page + '&itemsCount=' + count + '&searchTerm=' + encodeURIComponent(searchTerm));
    }
    
    getCustomerCities(): Observable<Lookup[]> {
        return this.http.get(this.api + '/cities');
    }
    
    getCount(filter = null): Observable<number> {
        return this.http.post(this.api + '/count', filter);
    }

    find(searchTerm: string): Observable<Customer[]> {
        return this.http.get(this.api + '/search?term=' + searchTerm);
    }
    
    getById(id: string): Observable<Customer> {
        return this.http.get(this.api + '/' + id);
    }

    calculatePurchaseData(points: CustomerPoint[]): PurchaseData {
        if (!points) {
            return null;
        }
        var remainder: number = null;
        var purchaseData: PurchaseData = {
            currentPurchaseAmount: 0
        };
        points.forEach(point => {
            if (point.correspondingAmount != null) {
                if (!point.isRedeemed) {
                    purchaseData.currentPurchaseAmount += point.correspondingAmount;
                }
                if (point.remainder) {
                    remainder += point.remainder;
                }
            }
        });

        purchaseData.remainder = remainder;
        purchaseData.currentPurchaseAmountString = purchaseData.currentPurchaseAmount + " " + this.user.getCurrency();
        return purchaseData;
    }

    create(customer: Customer): Observable<string> {
        return this.http.post(this.api, customer);
    }

    //delete(id: number): Observable<void> {
    //    return Observable.of(null);
    //}
    
    update(customer: Customer): Observable<number> {
        // If all fields of address are empty except country, consider as null
        if (customer.address && !customer.address.addressLine1 && !customer.address.addressLine2 &&
        !customer.address.area && !customer.address.city && !customer.address.state && !customer.address.zipCode) {
            customer.address = null;
        }

        return this.http.put(this.api + '/' + customer.id, customer);
    }

    saveEntry(customerId: string, amount: number): Observable<Customer> {
        return this.http.post(this.api + '/' + customerId + '/entry', amount);
    }

    giveDiscount(customerId: string): Observable<Customer> {
        return this.http.post(this.api + '/' + customerId + '/discount', {});
    }

    deletePoints(point: CustomerPoint): Observable<number> {
        return this.http.delete(this.api + '/points/' + point.id);
    }

    deleteExpense(expense: CustomerExpense): Observable<Customer> {
        return this.http.delete(this.api + '/expenses/' + expense.id);
    }

    getExpenses(customerId: string, from: Date, to: Date): Observable<CustomerExpense[]> {
        return this.http.post(this.api + '/' + customerId + '/expenses', {
            from: from,
            to: to
        });
    }

    sendApplicationSms(customerId: string): Observable<void> {
        return this.http.post(this.api + '/' + customerId + '/sms/send', {});
    }
}

