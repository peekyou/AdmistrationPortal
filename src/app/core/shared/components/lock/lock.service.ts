import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';

import { APP_CONFIG, AppConfig } from '../../../../app.config';
import { AuthHttpService } from '../../../services/auth-http.service';

@Injectable()
export class LockService {
    private api: string;
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint;        
    }

    upgradePackage(packageId: number): Observable<void> {
        return this.http.post(this.api + '/packages/upgrade/' + packageId, {});
    }
}