import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../user/user.service';
import { PackService } from '../pack/pack.service';
import { PackPurchaseModal } from '../pack/pack-purchase.modal';

@Component({
    styleUrls: ['./sms-campaign.component.scss'],
    templateUrl: './sms-campaign.component.html'
})
export class SmsCampaignComponent {
    quota: number;

    constructor(
        private modalService: NgbModal,
        private packService: PackService,
        public user: UserService) {

        this.packService.getSmsQuota()
        .subscribe(
            res => this.quota = res,
            err => console.log(err)
        );
    }

    openSmsPackModal() {
        const modalRef = this.modalService.open(PackPurchaseModal);
        modalRef.componentInstance.quota = this.quota;
    }
}