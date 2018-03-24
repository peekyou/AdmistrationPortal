import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { SegmentationStatistics } from './segmentation-statistics';
import { GroupBarChartData } from '../../core/shared/components/group-bar-chart/group-bar-chart';
import { SearchFilter } from '../../core/models/search-filter';
import { Customer, CustomerExpense } from '../customer/customer';

@Injectable()

export class StatsService {
    private api: string;
    
    constructor(@Inject(APP_CONFIG) config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint;
    }
    
    getSegmentationStatistics(searchFilter: SearchFilter): Observable<SegmentationStatistics> {
        return this.http.post(this.api + '/statistics/segmentation', searchFilter);
    }

    getGroupedStatistics(dataTypes: number[], searchFilter: SearchFilter): Observable<GroupBarChartData[]> {
        return this.http.post(this.api + '/statistics/grouped', { 
            dataTypes: dataTypes,
            dateFilter: searchFilter
        });
    }

    getTotalExpenses(searchFilter: SearchFilter): Observable<number> {
        return this.http.post(this.api + '/merchants/expenses/amount', searchFilter);            
    }

    getBestCustomers(searchFilter: SearchFilter): Observable<Customer[]> {
        return this.http.post(this.api + '/customers/best', searchFilter);            
    }
    
    getExpenses(searchFilter: SearchFilter): Observable<CustomerExpense[]> {
        return this.http.post(this.api + '/statistics/expenses', searchFilter);
    }
}
