import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { UserService } from '../user/user.service';
import { SearchService } from '../../core/services/search.service';
import { SearchFilter } from '../../core/models/search-filter';
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
    public userManagementPermission = Permissions.Management;
    public billsPermission = Permissions.Bills;
    public statisticsPermission = Permissions.Statistics;
    form: FormGroup;

    constructor(
        @Inject(APP_CONFIG) config: AppConfig,
        private fb: FormBuilder,
        private searchService: SearchService,
        public user: UserService, 
        public translate: TranslateService,
        public router: Router) { 

            this.form = this.fb.group({
                dateFrom: [null],
                dateTo: [null],
            }, { validator: dateLessThanValidation('dateFrom', 'dateTo') });
    }

    showMenu(): boolean {
        return false;
    }

    submit(param: string = null) {
        var from: Date = null;
        var to: Date = null;

        if (param != null && param !== 'all') {
            from = moment().startOf(<any>param).toDate();
            to = moment().utc().endOf(<any>param).toDate();
        }
        else if (param !== 'all') {
            from = ngbDateStructToDate(this.dateFrom.value);
            to = ngbDateStructToDate(this.dateTo.value);
            if (to) {
                to.setUTCHours(23);
                to.setUTCMinutes(59);
                to.setUTCSeconds(59);
            }
        }

        this.searchService.searchFilter = new SearchFilter(from, to);
    }
    
    get dateFrom() { return this.form.get('dateFrom'); }
    get dateTo() { return this.form.get('dateTo'); }
}