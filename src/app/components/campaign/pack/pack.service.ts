import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../../app.config';
import { AuthHttpService } from '../../../core/services/auth-http.service';
import { Pack } from './pack';

@Injectable()

export class PackService {
    backOfficeUrl: string;

    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
    }

    getSmsQuota(): Observable<number> {
        return this.http.get(this.config.ApiEndpoint + '/merchants/sms/quota');
    }

    getSmsPackInfos(): Observable<Pack> {
        return this.http.get(this.config.ApiEndpoint + '/sms/pack');
    }
    
    buySmsPack(packNumber: number): Observable<number> {
        return this.http.post(this.config.ApiEndpoint + '/sms/pack/buy', packNumber);
    }
    
    getPushQuota(): Observable<number> {
        return this.http.get(this.config.ApiEndpoint + '/merchants/push/quota');
    }

    getPushPackInfos(): Observable<Pack> {
        return this.http.get(this.config.ApiEndpoint + '/push/pack');
    }
    
    buyPushPack(packNumber: number): Observable<number> {
        return this.http.post(this.config.ApiEndpoint + '/push/pack/buy', packNumber);
    }
    
    getBackOfficeUrl(): Observable<string> {
        if (this.backOfficeUrl) {
            return Observable.of(this.backOfficeUrl);
        }
        return this.http.get(this.config.ApiEndpoint + '/merchants/url/backoffice')
                        .map(res => this.backOfficeUrl = res);
    }
}

