import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { AppSettings } from '../../app.settings';

@Injectable()

export class MobilePreviewService {
    public applicationUrl: string;
    
    constructor(private http: AuthHttpService) {
    }
    
    getApplicationUrl(): Observable<string> {
        if (this.applicationUrl) {
            return Observable.of(this.applicationUrl);
        }
        return this.http.get(AppSettings.API_ENDPOINT + '/merchants/url');
    }
}

