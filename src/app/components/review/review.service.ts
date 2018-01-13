import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { Review } from './review';
import { PagingResponse } from '../../core/models/paging';
import { AppSettings } from '../../app.settings';

@Injectable()
export class ReviewService {
    private api = AppSettings.API_ENDPOINT + '/reviews';

    constructor(private http: AuthHttpService) {
    }

    getAll(page: number, count: number): Observable<PagingResponse<Review>> {
        return this.http.get(this.api + '?pageNumber=' + page + '&itemsCount=' + count);
    }
}

