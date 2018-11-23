import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { UserService } from '../user/user.service';
import { Customer, CustomerExpense, CustomerFilter, CustomerPoint, PurchaseData, CustomerExpenseSave } from './customer';
import { PagingResponse } from '../../core/models/paging';
import { TableSearch } from '../../core/models/tableSearch';
import { Lookup } from '../../core/models/lookup';

@Injectable()

export class CustomerService {
    private api: string;
    customerSearched: Customer;
    searchTerm: string;

    constructor(@Inject(APP_CONFIG) public config: AppConfig, private http: AuthHttpService, private user: UserService) {
        this.api = config.ApiEndpoint + '/customers';
    }

    get(search: TableSearch): Observable<PagingResponse<Customer>> {
        if (search.pageNumber) search.pageNumber = search.pageNumber.toString();
        if (search.itemsCount) search.itemsCount = search.itemsCount.toString();
        return this.http.post(this.api + '/search', search);
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
    
    update(customer: Customer): Observable<Customer> {
        // If all fields of address are empty except country, consider as null
        if (customer.address && !customer.address.addressLine1 && !customer.address.addressLine2 &&
        !customer.address.area && !customer.address.city && !customer.address.state && !customer.address.zipCode) {
            customer.address = null;
        }

        return this.http.put(this.api + '/' + customer.id, customer);
    }

    saveExpense(expense: CustomerExpenseSave): Observable<Customer> {
        return this.http.post(this.api + '/expense', expense);
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

    getFormConfiguration(): Observable<any> {
        return this.http.get('/customer-assets/form.json');
    }
}

