import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { Review, ReviewsAverage } from './review';
import { PagingResponse } from '../../core/models/paging';

@Injectable()
export class ReviewService {
    private api: string;
    
    constructor(@Inject(APP_CONFIG) config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint + '/reviews';
    }

    getAll(page: number, count: number): Observable<PagingResponse<Review>> {
        return this.http.get(this.api + '?pageNumber=' + page + '&itemsCount=' + count);
    }

    getAverage(): Observable<ReviewsAverage> {
        return this.http.get(this.api + '/average');
    }
}

