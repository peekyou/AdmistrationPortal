import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { UserService } from '../user/user.service';

@Injectable()

export class MobilePreviewService {
    public applicationUrl: string;
    
    constructor(
        @Inject(APP_CONFIG) private config: AppConfig, 
        private http: AuthHttpService,
        private user: UserService) {
    }
    
    getApplicationUrl(): Observable<string> {
        if (this.applicationUrl) {
            return Observable.of(this.applicationUrl);
        }
        return this.http.get(this.config.ApiEndpoint + '/merchants/url')
                        .map(res => this.applicationUrl = this.formatUrl(res));
    }

    getApplicationHTML(url: string): Observable<string> {
        return this.http.get(url);        
    }

    formatUrl(url: string) {
        return url + '/reg/0' + this.user.getSystemCustomerId();
    }
}

