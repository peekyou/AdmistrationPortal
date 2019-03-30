import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Promotion, PromotionFilter } from './promotion';
import { UserService } from '../../user/user.service';
import { PromotionService } from './promotion.service';
import { ngbDateStructToDate, dateToNgbDateStruct, dateLessThanValidation } from '../../../core/helpers/utils';
import { PagingResponse } from '../../../core/models/paging';
import { NotificationService } from '../../../core/shared/components/notifcations/notification.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AppModal } from '../../../core/shared/modals/modal';
import { SmsPreviewModal } from '../../../core/shared/modals/sms-preview/sms-preview.modal';

@Component({
    selector: 'app-promotion',
    styleUrls: [ './promotion.component.scss' ],
    templateUrl: './promotion.component.html'
})
export class PromotionComponent {
    reload = false;
    modalTitle: string;
    modalSentence: string;
    modalConfirmation: string;

    // New promotion fields
    smsSentence: string = '';
    topLevelForm: FormGroup;
    submitSubscription: Subscription;

    @Input() quota: number = 0;
    @Input() campaignType: string;

    constructor(
        private modalService: NgbModal, 
        private service: PromotionService,
        private notifications: NotificationService,
        private translation: TranslationService,
        public user: UserService,
        private fb: FormBuilder) { 
            
        this.initForm();

        this.translation.getMultiple([
            'PROMOTIONS.MODAL_TITLE',
            'PROMOTIONS.MODAL_SENTENCE',
            'COMMON.CONFIRMATION_QUESTION'], x => {
                this.modalTitle = x['PROMOTIONS.MODAL_TITLE'];
                this.modalSentence = x['PROMOTIONS.MODAL_SENTENCE'];
                this.modalConfirmation = x['COMMON.CONFIRMATION_QUESTION'];
        });
    }

    initForm() {
        var firstForm = this.fb.group({
            // promotionType: ['sms', Validators.required],
            name: new FormControl('', {
                validators: Validators.required,
                updateOn: 'blur'
            }),
            dateFrom: [dateToNgbDateStruct(new Date()), Validators.required],
            dateTo: [null, Validators.required],
            percentage: [''],
            details: [this.smsSentence, Validators.required],
            nbRecipients: [null],
            nbSmsPerCustomer: [null]
        }, { validator: dateLessThanValidation('dateFrom', 'dateTo') });

        var secondForm = this.fb.group({
            currentPointsMin: [''],
            currentPointsMax: [''],
            cumulatedPointsMin: [''],
            cumulatedPointsMax: [''],
            purchaseAmountMin: [''],
            purchaseAmountMax: [''],
            customerName: [''],
            customerGenderMale: [true],
            customerGenderFemale: [true],
            location: [[]],
            customerAgeFrom: [null],
            customerAgeTo: [null],
            customerSince: [null],
            lastEntryFrom: [null],
            lastEntryTo: [null],
            receivedPromotion: [''],
            didntReceivePromotion: ['']
        });

        this.topLevelForm = this.fb.group({
            stepInfo: firstForm,
            stepFilter: secondForm
        });
    }

    openModal() {
        var promoInfo = this.topLevelForm.value['stepInfo'];
        var sentence = '';
        var modalRef = null;
        if (this.campaignType == 'sms') {
            modalRef = this.modalService.open(SmsPreviewModal);
            modalRef.componentInstance.sms = promoInfo.details;            
            modalRef.componentInstance.smsNumber = promoInfo.nbRecipients * promoInfo.nbSmsPerCustomer;
        }
        else {
            modalRef = this.modalService.open(AppModal);
            modalRef.componentInstance.title = this.modalTitle;
            modalRef.componentInstance.text1 = sentence;
            modalRef.componentInstance.text2 = this.modalConfirmation;
        }
        
        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.submit();
            }
        }, (reason) => { });
    }
    
    submit() {
        var promoInfo = this.topLevelForm.value['stepInfo'];
        var promoFilter = this.topLevelForm.value['stepFilter'];
        let newPromotion: Promotion = {
            createdDate: new Date(),
            details: promoInfo.details,
            name: promoInfo.name,
            promotionType: this.campaignType,
            fromDate: ngbDateStructToDate(promoInfo.dateFrom),
            toDate: ngbDateStructToDate(promoInfo.dateTo),
            percentage: promoInfo.percentage,
            nbRecipients: promoInfo.nbRecipients,
            filter: PromotionFilter.createFromForm(promoFilter)
        };

        this.submitSubscription = this.service
            .create(newPromotion)
            .subscribe(
                p => {
                    this.reload = true;
                    // this.reset();
                },
                err => { 
                    var e = err.error && err.error.errorCode ? err.error.errorCode : null;
                    this.notifications.setErrorNotification(e);
                 }
            );
    }

    reset() {
        this.topLevelForm.reset();
    }
}