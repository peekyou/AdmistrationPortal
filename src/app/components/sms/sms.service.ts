import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { AppSettings } from '../../app.settings';

@Injectable()

export class SmsService {
    private api = '/sms.json';

    constructor(private http: AuthHttpService) {

    }
}

