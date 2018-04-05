import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Promotion, PromotionFilter } from './promotion';
import { PromotionService } from './promotion.service';
import { ngbDateStructToDate, dateToNgbDateStruct, dateLessThanValidation } from '../../core/helpers/utils';
import { PagingResponse } from '../../core/models/paging';
import { EmailCampaignModal } from '../../core/shared/modals/email-campaign/email-campaign.modal';

@Component({
    selector: 'promotion',
    styleUrls: [ './promotion.component.scss' ],
    templateUrl: './promotion.component.html'
})
export class PromotionComponent {
    reload = false;

    // New promotion fields
    smsSentence: string = 'Your store is pleased to propose a promotion';
    topLevelForm: FormGroup;
    submitSubscription: Subscription;

    constructor(private modalService: NgbModal, private service: PromotionService, private fb: FormBuilder) { 
        this.init();
    }

    openEmailModal() {
        const modalRef = this.modalService.open(EmailCampaignModal);
        // modalRef.result.then((result) => {
        //     if (result === 'Y') {
        //         this.sendEmail();
        //     }
        // }, (reason) => { });
    }

    init() {
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
            cities: [[]],
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
                err => { console.log(err); }
            );
    }

    reset() {
        this.topLevelForm.reset();
    }
}
