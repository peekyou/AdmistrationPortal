import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { SegmentationStatistics } from './segmentation-statistics';
import { GroupBarChartData } from '../../core/shared/components/group-bar-chart/group-bar-chart';
import { Customer, CustomerExpense } from '../customer/customer';

@Injectable()

export class StatsService {
    private api: string;
    
    constructor(@Inject(APP_CONFIG) config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint;
    }
    
    getSegmentationStatistics(): Observable<SegmentationStatistics> {
        return this.http.get(this.api + '/statistics/segmentation');
    }

    getGroupedStatistics(dataTypes: number[]): Observable<GroupBarChartData[]> {
        return this.http.post(this.api + '/statistics/grouped', { dataTypes: dataTypes });
    }

    getTotalExpenses(): Observable<number> {
        return this.http.get(this.api + '/merchants/expenses/amount');            
    }

    getBestCustomer(): Observable<Customer> {
        return this.http.get(this.api + '/customers/best');            
    }
    
    getExpenses(searchFilters): Observable<CustomerExpense[]> {
        return this.http.post(this.api + '/statistics/expenses', searchFilters);
    }
}
