import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './email-campaign.modal.html'
})
export class EmailCampaignModal {

    constructor(public activeModal: NgbActiveModal) { }
 }