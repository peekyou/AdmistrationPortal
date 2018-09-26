import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { Promotion, PromotionFilter } from './promotion';
import { PagingResponse } from '../../core/models/paging';
import { Lookup } from '../../core/models/lookup';

@Injectable()
export class PromotionService {
    private api: string;
    public nbRecipients: number;
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint + '/promotions';
    }

    get(page: number, count: number): Observable<PagingResponse<Promotion>> {
        return this.http.get(this.api + '?pageNumber=' + page + '&itemsCount=' + count);
    }

    getAll(): Observable<PagingResponse<Promotion>> {
        return this.http.get(this.api);
    }
    
    create(promotion: Promotion): Observable<string> {
        return this.http.post(this.api, promotion);
    }

    customerCount(filter: PromotionFilter, promotionType: string): Observable<number> {
        return this.http.post(this.api + '/' + promotionType + '/customers/count', filter);
    }
}