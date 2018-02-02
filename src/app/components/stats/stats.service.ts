import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { AppSettings } from '../../app.settings';
import { SegmentationStatistics } from './segmentation-statistics';

@Injectable()

export class StatsService {
    private api = AppSettings.API_ENDPOINT + '/statistics';
    
        constructor(private http: AuthHttpService) {
        }
    
        getSegmentationStatistics(): Observable<SegmentationStatistics> {
            return this.http.get(this.api + '/segmentation');
        }
}

