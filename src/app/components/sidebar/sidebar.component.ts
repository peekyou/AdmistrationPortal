import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../user/user.service';
import { ContentEditorService } from '../content-editor/content-editor.service';
import { Permissions } from '../../core/helpers/permissions';
import { MerchantDesign } from '../../core/models/merchantDesign';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    logo: string;
    public showUserContainer: boolean = false;
    public customersPermission = Permissions.Customers;
    public contentPermission = Permissions.Content;
    public reviewsPermission = Permissions.Reviews;
    public promotionsPermission = Permissions.Promotions;
    public smsPermission = Permissions.SMS;
    public emailPermission = Permissions.Email;
    public userManagementPermission = Permissions.Management;
    public billsPermission = Permissions.Bills;
    public statisticsPermission = Permissions.Statistics;

    constructor(
        public user: UserService, 
        public translate: TranslateService, 
        content: ContentEditorService) { 
            content.getDesign()
                   .subscribe(
                       res => this.logo = res && res.logo ? res.logo.src : null
                   );
        }

    showMenu(): boolean {
        return false;
    }
}