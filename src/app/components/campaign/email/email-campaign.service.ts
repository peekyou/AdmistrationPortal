import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../../app.config';
import { AuthHttpService } from '../../../core/services/auth-http.service';

@Injectable()

export class EmailCampaignService {
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
    }

    getEmailCount(): Observable<number> {
        return this.http.get(this.config.ApiEndpoint + '/customers/emails/count');
    }

    requestEmailTool(): Observable<boolean> {
        return this.http.post(this.config.ApiEndpoint + '/merchants/emailtool', {});
    }
}

