import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EmailCampaignService } from './email-campaign.service';
import { EmailCampaignModal } from '../../../core/shared/modals/email-campaign/email-campaign.modal';
import { UserService } from '../../user/user.service';

@Component({
    styleUrls: ['./email-campaign.component.scss'],
    templateUrl: './email-campaign.component.html'
})
export class EmailCampaignComponent {
    emailCount: number = null;

    constructor(service: EmailCampaignService, private modalService: NgbModal, public user: UserService) {
        service.getEmailCount()
            .subscribe(
                c => this.emailCount = c,
                err => console.log(err)
            );
    }

    openEmailModal() {
        const modalRef = this.modalService.open(EmailCampaignModal);
        // modalRef.result.then((result) => {
        //     if (result === 'Y') {
        //         this.sendEmail();
        //     }
        // }, (reason) => { });
    }
}