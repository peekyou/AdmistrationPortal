import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Promotion, PromotionFilter } from '../promotion';
import { PromotionService } from '../promotion.service';
import { ngbDateStructToDate } from '../../../core/helpers/utils';

@Component({
    styleUrls: ['./promotion-new.component.scss'],
    templateUrl: './promotion-new.component.html'
})
export class PromotionNewComponent {
    smsSentence: string = 'Your store is pleased to propose a promotion';
    topLevelForm: FormGroup;
    steps: any[];
    currentStep: any;
    submitSubscription: Subscription;

    constructor(private service: PromotionService, private fb: FormBuilder, private router: Router) {
        this.init();
        this.currentStep = this.topLevelForm.controls['stepInfo'];
    }
        
    init() {
        var firstForm = this.fb.group({
            name: ['', Validators.required],
            dateFrom: [null, Validators.required],
            dateTo: [null, Validators.required],
            percentage: [''],
            details: [this.smsSentence, Validators.required]
        }, { validator: this.dateLessThan('dateFrom', 'dateTo') });

        var secondForm = this.fb.group({
            currentPointsMin: [''],
            currentPointsMax: [''],
            cumulatedPointsMin: [''],
            cumulatedPointsMax: [''],
            purchaseAmountMin: [''],
            purchaseAmountMax: [''],
            customerName: [''],
            customerGender: ['U'],
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

        this.steps = [firstForm, secondForm];
    }
    
    dateLessThan(from: string, to: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let f = group.controls[from];
            let t = group.controls[to];
            if (f.value && t.value && ngbDateStructToDate(f.value) > ngbDateStructToDate(t.value)) {
                return {
                    dates: 'From date must be before to date'
                };
            }
            return {};
        }
    }
    
    next() {
        var currentIndex = this.steps.indexOf(this.currentStep);
        if (currentIndex < this.steps.length) {
            this.currentStep = this.steps[currentIndex + 1];
        }
    }
    
    previous() {
        var currentIndex = this.steps.indexOf(this.currentStep);
        if (currentIndex > 0) {
            this.currentStep = this.steps[currentIndex - 1];
        }
    }
    
    submit() {
        var promoInfo = this.topLevelForm.value['stepInfo'];
        var promoFilter = this.topLevelForm.value['stepFilter'];
        let newPromotion: Promotion = {
            createdDate: new Date(),
            details: promoInfo.details,
            name: promoInfo.name,
            fromDate: ngbDateStructToDate(promoInfo.dateFrom),
            toDate: ngbDateStructToDate(promoInfo.dateFrom),
            percentage: promoInfo.percentage,
            filter: PromotionFilter.createFromForm(promoFilter)
        };

        this.submitSubscription = this.service
            .create(newPromotion)
            .subscribe(
                p => this.router.navigate(['/promotions/list']),
                err => { console.log(err); }
            );
    }
}