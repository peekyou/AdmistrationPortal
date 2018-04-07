import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EmailCampaignService } from '../../../../components/email-campaign/email-campaign.service';

@Component({
    templateUrl: './email-campaign.modal.html'
})
export class EmailCampaignModal {
    error: boolean;
    sending = false;

    constructor(public activeModal: NgbActiveModal, private service: EmailCampaignService) { }

    sendEmail() {
        this.sending = true;
        this.service.requestEmailTool()
            .subscribe(
                response => {
                    this.error = !response;
                    this.sending = false;
                    if (response === true) {
                        setTimeout(() => {
                            this.activeModal.close();
                       }, 5000);
                    }
                },
                err => { 
                    this.error = true;
                    this.sending = false;
                    console.log(err);
                }
            );
    }
 }