import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { Promotion, PromotionFilter } from './promotion';
import { PagingResponse } from '../../core/models/paging';

@Injectable()
export class PromotionService {
    private api: string;
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint + '/promotions';
    }

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
        return this.http.post(this.config.ApiEndpoint + '/merchants/emailtool', {});
    }
}