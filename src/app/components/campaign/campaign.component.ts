import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../user/user.service';
import { Permissions } from '../../core/helpers/permissions';

@Component({
    styleUrls: ['./campaign.component.scss'],
    templateUrl: './campaign.component.html'
})
export class CampaignComponent {
    public marketingPermission = Permissions.Marketing;
    public smsPermission = Permissions.SMS;
    public emailPermission = Permissions.Email;

    constructor(public user: UserService) {
    }
}