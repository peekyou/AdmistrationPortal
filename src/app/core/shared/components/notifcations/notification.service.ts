import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { APP_CONFIG, AppConfig } from '../../../../app.config';
import { AuthHttpService } from '../../../services/auth-http.service';
import { AppNotification } from './notification';
import { TranslationService } from '../../../services/translation.service';

@Injectable()
export class NotificationService {
    private api: string;
    notification1: AppNotification = {};
    notification2: AppNotification = {};
    notification3: AppNotification = {};

    constructor(@Inject(APP_CONFIG) config: AppConfig, private http: AuthHttpService, private translation: TranslationService) {
        this.api = config.ApiEndpoint;
    }
    
    getApplicationSmsStatus(mobileNumber: string, customerName: string) {
        setTimeout(
            this.http.get(this.api + '/customers/sms/' + mobileNumber.replace('+', '') + '/status')
            .subscribe(
                res => {
                    if (!res || res == 'Undelivered') {
                        this.translation.get('CUSTOMERS.REGISTRATION_SMS_UNDELIVERED', x => {
                            if (x) {
                                var errorMessage = x + ' ' + mobileNumber + ' (' + customerName + ')';
                                this.setNotification(errorMessage, true);
                            }              
                        });

                    }
        }), 2000);

    }

    setNotification(message: string, error: boolean) {
        if (!this.notification1.message) {
            this.notification1 = { error: error, message: message };
        }
        else if (!this.notification2.message) {
            this.notification2 = { error: error, message: message };
        }
        else if (!this.notification3.message) {
            this.notification3 = { error: error, message: message };
        }
        else {
            this.notification1 = { error: error, message: message };
        }
    }
}