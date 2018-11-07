import { Component, Input, HostListener, ElementRef } from '@angular/core';

import { UserService } from '../user/user.service';
import { Permissions } from '../../core/helpers/permissions';
import { SearchService } from '../../core/services/search.service';

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
    isNavbarCollapsed = true;

    @HostListener('document:click', ['$event.path'])
    onClickOutside($event: Array<any>) {
        const elementRefInPath = $event.find(node => node === this._element.nativeElement);
        if (!elementRefInPath) {
            this.isNavbarCollapsed = true;
        }
    }

    constructor(
        private _element: ElementRef,
        public user: UserService,
        public searchService: SearchService) { 
    }

    showMenu(): boolean {
        return false;
    }
}