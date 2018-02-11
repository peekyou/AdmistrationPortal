import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../user/user.service';
import { Permissions } from '../../core/helpers/permissions';
import { AppSettings } from '../../app.settings';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    public title = AppSettings.MerchantName;
    public showUserContainer: boolean = false;
    public customersPermission = Permissions.Customers;
    public contentPermission = Permissions.Content;
    public reviewsPermission = Permissions.Reviews;
    public promotionsPermission = Permissions.Promotions;
    public smsPermission = Permissions.SMS;
    public userManagementPermission = Permissions.UserManagement;
    public billsPermission = Permissions.Bills;
    public statisticsPermission = Permissions.Statistics;

    constructor(public user: UserService, public translate: TranslateService) { }

    showMenu(): boolean {
        return false;
    }
}