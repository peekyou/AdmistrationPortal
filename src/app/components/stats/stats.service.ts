import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { AppSettings } from '../../app.settings';
import { SegmentationStatistics } from './segmentation-statistics';
import { GroupBarChartData } from '../../core/shared/components/group-bar-chart/group-bar-chart';

@Injectable()

export class StatsService {
    private api = AppSettings.API_ENDPOINT + '/statistics';
    
        constructor(private http: AuthHttpService) {
        }
        
        getSegmentationStatistics(): Observable<SegmentationStatistics> {
            return this.http.get(this.api + '/segmentation');
        }

        getGroupedStatistics(dataTypes: number[]): Observable<GroupBarChartData[]> {
            return this.http.post(this.api + '/grouped', { dataTypes: dataTypes });
        }
}
