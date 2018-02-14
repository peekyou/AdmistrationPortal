import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { AppSettings } from '../../app.settings';

@Injectable()

export class SmsService {
    private api = AppSettings.API_ENDPOINT + '/merchants/sms';

    constructor(private http: AuthHttpService) {

    }

    getQuota(): Observable<number> {
        return this.http.get(this.api + '/quota');
    }
}

