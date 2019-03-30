import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { TranslationService } from '../../../core/services/translation.service';
import { PackService } from './pack.service';
import { UserService } from '../../user/user.service';
import { AppModal } from '../../../core/shared/modals/modal';
import { Pack } from './pack';

@Component({
    styleUrls: ['./pack-purchase.modal.scss'],
    templateUrl: './pack-purchase.modal.html'
})
export class PackPurchaseModal implements OnInit {
    loading: boolean;
    subtitle: string;
    modalTitle: string;
    modalSentence: string;
    modalConfirmation: string;
    packNumber: number = 1;
    pack: Pack;
    quota = 0;
    type: string;
    currency: string;
    redirectSuccessUrl: string;
    redirectCancelUrl: string;

    constructor(
        private service: PackService,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private translation: TranslationService,
        public user: UserService) {

        this.currency = user.getAppwardsCurrency();
        if (!this.currency) {
            this.currency = user.getCurrency();
        }
        this.loading = true;
    }

    public ngOnInit() {
        this.getTranslations();
        this.getPackInfo();
        this.setUrl();
    }

    onInputChange(event: KeyboardEvent) {
        if (!(event.charCode >= 48 && event.charCode <= 57)) {
            event.preventDefault();
        }
    }

    getPackInfo() {
        this.getPack()
            .subscribe(
                res => {
                    this.pack = res;
                    this.loading = false;
                },
                err => console.log(err)
            )
    }

    setUrl() {
        this.service.getBackOfficeUrl()
            .subscribe(url => {
                this.redirectCancelUrl = url + '/campaigns/' + this.type;
                this.redirectSuccessUrl = url + '/campaigns/' + this.type + '?payment=s&c=' + this.packNumber;
            });
    }

    openModal() {
        const modalRef = this.modalService.open(AppModal);
        modalRef.componentInstance.title = this.modalTitle;
        modalRef.componentInstance.text1 = this.modalSentence.replace('{{number}}', (this.packNumber * this.pack.number).toString()).replace('{{price}}', (this.packNumber * this.pack.price).toString()).replace('{{currency}}', this.currency);
        modalRef.componentInstance.text2 = this.modalConfirmation;
    }

    private getPack(): Observable<Pack> {
        return this.type == 'sms' ? this.service.getSmsPackInfos() : this.service.getPushPackInfos();
    }

    private getTranslations() {
        var category = this.type.toUpperCase();
        this.translation.getMultiple([
            category + '_PACKS.' + category,
            category + '_PACKS.MODAL_TITLE',
            category + '_PACKS.MODAL_SENTENCE',
            'COMMON.CONFIRMATION_QUESTION'], x => {
                this.subtitle = x[category + '_PACKS.' + category];
                this.modalTitle = x[category + '_PACKS.MODAL_TITLE'];
                this.modalSentence = x[category + '_PACKS.MODAL_SENTENCE'];
                this.modalConfirmation = x['COMMON.CONFIRMATION_QUESTION'];
        });
    }
 }