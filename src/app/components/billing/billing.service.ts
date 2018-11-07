import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { PagingResponse } from '../../core/models/paging';
import { Bill } from './bill';

@Injectable()

export class BillingService {
    private api: string;
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint + '/bills';
    }

    getBills(page: number, count: number): Observable<PagingResponse<Bill>> {
        return this.http.get(this.api + '?pageNumber=' + page + '&itemsCount=' + count);
    }

    downloadBill(id: string) {
        return this.http.download(this.api + '/download/' + id)
        .subscribe(data => { },
        err => { console.log(err); });
    }
}

