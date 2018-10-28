import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { UserService } from '../user/user.service';
import { SearchService } from '../../core/services/search.service';
import { SearchFilter } from '../../core/models/searchFilter';
import { Permissions } from '../../core/helpers/permissions';
import { dateLessThanValidation, ngbDateStructToDate } from '../../core/helpers/utils';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    param = 'months';
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
        public searchService: SearchService,
        public user: UserService, 
        public translate: TranslateService,
        public router: Router) { 

            this.form = this.fb.group({
                dateFrom: [null],
                dateTo: [null],
            }, { validator: dateLessThanValidation('dateFrom', 'dateTo') });
    }

    ngOnInit() {
    }

    showMenu(): boolean {
        return false;
    }

    submit(param: string = null) {
        this.param = param;
        var from: Date = null;
        var to: Date = null;

        if (param != null && param !== 'all') {
            if (param === 'day') {
                from = moment().startOf(<any>param).toDate();
                to = moment().endOf(<any>param).toDate();
            }
            else {
                from = moment().subtract(1, <any>param).startOf('day').toDate();
                to = moment().endOf('day').toDate();
            } 
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