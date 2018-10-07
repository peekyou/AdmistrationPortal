import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Promotion, PromotionFilter } from './promotion';
import { UserService } from '../user/user.service';
import { PromotionService } from './promotion.service';
import { ngbDateStructToDate, dateToNgbDateStruct, dateLessThanValidation } from '../../core/helpers/utils';
import { PagingResponse } from '../../core/models/paging';
import { NotificationService } from '../../core/shared/components/notifcations/notification.service';
import { TranslationService } from '../../core/services/translation.service';
import { AppModal } from '../../core/shared/modals/modal';

@Component({
    selector: 'promotion',
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
            promotionType: ['sms', Validators.required],
            name: ['', Validators.required],
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
            // customField1: [null],
            // customField2: [null],
            // customField3: [null],
            // customField4: [null],
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
        const modalRef = this.modalService.open(AppModal);
        modalRef.componentInstance.title = this.modalTitle;
        modalRef.componentInstance.text1 = this.modalSentence.replace('{{smsNumber}}', (promoInfo.nbRecipients * promoInfo.nbSmsPerCustomer).toString());
        modalRef.componentInstance.text2 = this.modalConfirmation;
        
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
            promotionType: promoInfo.promotionType,
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
                    console.log(err);
                    this.notifications.setErrorNotification();
                 }
            );
    }

    reset() {
        this.topLevelForm.reset();
    }
}