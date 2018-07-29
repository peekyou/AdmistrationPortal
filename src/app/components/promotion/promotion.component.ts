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

@Component({
    selector: 'promotion',
    styleUrls: [ './promotion.component.scss' ],
    templateUrl: './promotion.component.html'
})
export class PromotionComponent {
    reload = false;

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
        this.init();
    }

    init() {
        // this.translation.get('PROMOTIONS.SMS_DEFAULT_TEMPLATE', x => {
        //     this.smsSentence = x;
        //     this.topLevelForm.value['stepInfo'].get('details').patchValue(x)
        // });

        var firstForm = this.fb.group({
            name: ['', Validators.required],
            dateFrom: [dateToNgbDateStruct(new Date()), Validators.required],
            dateTo: [null, Validators.required],
            percentage: [''],
            details: [this.smsSentence, Validators.required],
            nbRecipients: [null]
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
    
    submit() {
        var promoInfo = this.topLevelForm.value['stepInfo'];
        var promoFilter = this.topLevelForm.value['stepFilter'];
        let newPromotion: Promotion = {
            createdDate: new Date(),
            details: promoInfo.details,
            name: promoInfo.name,
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
                    this.reset();
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
