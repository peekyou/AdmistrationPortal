import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { Customer, CustomerExpense, CustomerPoint, PurchaseData } from './customer';
import { AppSettings } from '../../app.settings';

@Injectable()

export class CustomerService {
    private api = AppSettings.API_ENDPOINT + '/customers';
    customerSearched: Customer;
    searchTerm: string;

    constructor(private http: AuthHttpService) {
    }
    
    getAllCount(): Observable<number> {
        return this.http.get(this.api + '/count');
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
            currentPurchaseAmount: 0,
            totalPurchaseAmount: 0
        };
        points.forEach(point => {
            if (point.correspondingAmount != null) {
                purchaseData.totalPurchaseAmount += point.correspondingAmount;
                if (!point.isRedeemed) {
                    purchaseData.currentPurchaseAmount += point.correspondingAmount;
                }
                if (point.remainder) {
                    remainder += point.remainder;
                }
            }
        });
        //purchaseData.currentPurchaseAmount += remainder;
        //purchaseData.totalPurchaseAmount += remainder;

        purchaseData.remainder = remainder;
        purchaseData.currentPurchaseAmountString = purchaseData.currentPurchaseAmount + " AED";
        purchaseData.totalPurchaseAmountString = purchaseData.totalPurchaseAmount + " AED";
        return purchaseData;
    }

    create(customer: Customer): Observable<string> {
        return this.http.post(this.api, customer);
    }

    //delete(id: number): Observable<void> {
    //    return Observable.of(null);
    //}
    
    update(customer: Customer): Observable<number> {
        return this.http.put(this.api + '/' + customer.id, customer);
    }

    saveEntry(customerId: string, amount: number): Observable<Customer> {
        return this.http.post(this.api + '/' + customerId + '/entry', amount);
    }

    deletePoints(point: CustomerPoint): Observable<number> {
        return this.http.delete(this.api + '/points/' + point.id);
    }
}

