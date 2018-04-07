import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { SmsPack } from './sms-pack';

@Injectable()

export class SmsService {
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
    }

    getQuota(): Observable<number> {
        return this.http.get(this.config.ApiEndpoint + '/merchants/sms/quota');
    }

    getSmsPackInfos(): Observable<SmsPack> {
        return this.http.get(this.config.ApiEndpoint + '/sms/pack');
    }
    
    buySmsPack(packNumber: number): Observable<number> {
        return this.http.post(this.config.ApiEndpoint + '/sms/pack/buy', packNumber);
    }
}

