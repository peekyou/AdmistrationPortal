import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslationService } from '../../core/services/translation.service';
import { SmsService } from './sms.service';
import { UserService } from '../user/user.service';
import { AppModal } from '../../core/shared/modals/modal';
import { SmsPack } from './sms-pack';

@Component({
    styleUrls: ['./sms.component.scss'],
    templateUrl: './sms.component.html'
})
export class SmsComponent {
    loading: boolean;
    modalTitle: string;
    modalSentence: string;
    modalConfirmation: string;
    packNumber: number = 1;
    smsPack: SmsPack;
    quota = 0;
    currency: string;

    constructor(
        private service: SmsService,
        private modalService: NgbModal,
        private translation: TranslationService,
        user: UserService) {

        this.currency = user.getCurrency();
        this.loading = true;
        this.getQuota();
        this.getSmsPackInfo();

        this.translation.getMultiple([
            'SMS_PACKS.MODAL_TITLE',
            'SMS_PACKS.MODAL_SENTENCE',
            'COMMON.CONFIRMATION_QUESTION'], x => {
                this.modalTitle = x['SMS_PACKS.MODAL_TITLE'];
                this.modalSentence = x['SMS_PACKS.MODAL_SENTENCE'];
                this.modalConfirmation = x['COMMON.CONFIRMATION_QUESTION'];
        });
    }

    onInputChange(event: KeyboardEvent) {
        if (!(event.charCode >= 48 && event.charCode <= 57)) {
            event.preventDefault();
        }
    }

    getQuota() {
        this.service.getQuota()
            .subscribe(
                quota => this.quota = quota,
                err => console.log(err)
            )
    }

    getSmsPackInfo() {
        this.service.getSmsPackInfos()
            .subscribe(
                res => {
                    this.smsPack = res;
                    this.loading = false;
                },
                err => console.log(err)
            )
    }

    openModal() {
        const modalRef = this.modalService.open(AppModal);
        modalRef.componentInstance.title = this.modalTitle;
        modalRef.componentInstance.text1 = this.modalSentence.replace('{{smsNumber}}', (this.packNumber * this.smsPack.smsNumber).toString()).replace('{{price}}', (this.packNumber * this.smsPack.price).toString()).replace('{{currency}}', this.currency);
        modalRef.componentInstance.text2 = this.modalConfirmation;
        
        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.service.buySmsPack(this.packNumber)
                    .subscribe(
                        res => this.quota += res,
                        err => console.log(err)
                    );
            }
        }, (reason) => { });
    }
}