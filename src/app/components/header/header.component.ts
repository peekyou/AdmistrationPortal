import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { UserService } from '../user/user.service';
import { Permissions } from '../../core/helpers/permissions';
import { dateLessThanValidation, ngbDateStructToDate } from '../../core/helpers/utils';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    public showUserContainer: boolean = false;
    public customersPermission = Permissions.Customers;
    public contentPermission = Permissions.Content;
    public reviewsPermission = Permissions.Reviews;
    public promotionsPermission = Permissions.Promotions;
    public smsPermission = Permissions.SMS;
    public userManagementPermission = Permissions.UserManagement;
    public billsPermission = Permissions.Bills;
    public statisticsPermission = Permissions.Statistics;

    form: FormGroup;
    searchSubscription: Subscription;

    constructor(
        @Inject(APP_CONFIG) config: AppConfig,
        private fb: FormBuilder,
        public user: UserService, 
        public translate: TranslateService) { 

            this.form = this.fb.group({
                dateFrom: [null],
                dateTo: [null],
            }, { validator: dateLessThanValidation('dateFrom', 'dateTo') });
    }

    showMenu(): boolean {
        return false;
    }

    submit() {
        var from = ngbDateStructToDate(this.dateFrom.value);
        var to = ngbDateStructToDate(this.dateTo.value);
        to.setUTCHours(23);
        to.setUTCMinutes(59);
        to.setUTCSeconds(59);
    }
    
    get dateFrom() { return this.form.get('dateFrom'); }
    get dateTo() { return this.form.get('dateTo'); }
}