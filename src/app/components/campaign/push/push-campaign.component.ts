import { Component } from '@angular/core';

import { UserService } from '../../user/user.service';

@Component({
    styleUrls: ['./push-campaign.component.scss'],
    templateUrl: './push-campaign.component.html'
})
export class PushCampaignComponent {

    constructor(public user: UserService) {
    }
}