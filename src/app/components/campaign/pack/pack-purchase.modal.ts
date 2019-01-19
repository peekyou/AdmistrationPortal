import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

import { TranslationService } from '../../../core/services/translation.service';
import { PackService } from './pack.service';
import { UserService } from '../../user/user.service';
import { AppModal } from '../../../core/shared/modals/modal';
import { Pack } from './pack';

@Component({
    styleUrls: ['./pack-purchase.modal.scss'],
    templateUrl: './pack-purchase.modal.html'
})
export class PackPurchaseModal {
    loading: boolean;
    modalTitle: string;
    modalSentence: string;
    modalConfirmation: string;
    packNumber: number = 1;
    pack: Pack;
    quota = 0;
    currency: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: PackService,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private translation: TranslationService,
        public user: UserService) {

        this.currency = user.getCurrency();
        this.loading = true;
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

    public ngOnInit() {
        this.route.queryParams
            .switchMap(params => {
                var payment = params['payment'];
                var packCount = params['c'];
                if (payment == 's' && packCount) {
                    return Observable.of(packCount);
                }
                return Observable.of(0);
            })
            .subscribe(count => {
                if (count > 0) {
                    this.service.buySmsPack(count)
                        .subscribe(
                            res => this.quota += res,
                            err => console.log(err)
                        );
                }
            },
            err => { });
    }

    onInputChange(event: KeyboardEvent) {
        if (!(event.charCode >= 48 && event.charCode <= 57)) {
            event.preventDefault();
        }
    }

    getSmsPackInfo() {
        this.service.getSmsPackInfos()
            .subscribe(
                res => {
                    this.pack = res;
                    this.loading = false;
                },
                err => console.log(err)
            )
    }

    openModal() {
        const modalRef = this.modalService.open(AppModal);
        modalRef.componentInstance.title = this.modalTitle;
        modalRef.componentInstance.text1 = this.modalSentence.replace('{{smsNumber}}', (this.packNumber * this.pack.number).toString()).replace('{{price}}', (this.packNumber * this.pack.price).toString()).replace('{{currency}}', this.currency);
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