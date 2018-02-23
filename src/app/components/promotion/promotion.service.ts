import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { Promotion, PromotionFilter } from './promotion';
import { PagingResponse } from '../../core/models/paging';
import { AppSettings } from '../../app.settings';

@Injectable()
export class PromotionService {
    private api = AppSettings.API_ENDPOINT + '/promotions';

    constructor(private http: AuthHttpService) { }

    getAll(): Observable<PagingResponse<Promotion>> {
        return this.http.get(this.api);
    }
    
    create(promotion: Promotion): Observable<string> {
        return this.http.post(this.api, promotion);
    }

    customerCount(filter: PromotionFilter): Observable<number> {
        return this.http.post(this.api + '/customers/count', filter);
    }

    requestEmailTool(): Observable<boolean> {
        return this.http.post(AppSettings.API_ENDPOINT + '/merchants/emailtool', {});
    }
}