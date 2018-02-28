import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PromotionService } from './promotion.service';
import { Promotion } from './promotion';
import { PagingResponse } from '../../core/models/paging';
import { EmailCampaignModal } from '../../core/shared/modals/email-campaign/email-campaign.modal';

@Component({
    selector: 'promotion',
    styleUrls: [ './promotion.component.scss' ],
    templateUrl: './promotion.component.html'
})
export class PromotionComponent {
    loading = false;
    promotions: PagingResponse<Promotion>;

    constructor(private modalService: NgbModal, private service: PromotionService) { }

    openEmailModal() {
        const modalRef = this.modalService.open(EmailCampaignModal);
        // modalRef.result.then((result) => {
        //     if (result === 'Y') {
        //         this.sendEmail();
        //     }
        // }, (reason) => { });
    }

    
}
