import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Promotion } from '../../promotion';
import { PromotionService } from '../../promotion.service';
import { SmsCounter } from '../../../../core/helpers/smsCounter';
import { SmsService } from '../../../sms/sms.service';

@Component({
    selector: 'promotion-info',
    styleUrls: ['./promotion-info.component.scss'],
    templateUrl: './promotion-info.component.html'
})
export class PromotionInfoComponent implements OnInit {
    smsQuota: number;    
    smsTemplate: string = '{0}{1}{2}{3}';
    smsSentence: string = 'Your store is pleased to propose a promotion';
    smsPercentageTemplate: string = ' of {0}%';
    smsDateTemplate: string = ' from {0} to {1}';
    promotion: Promotion = new Promotion();

    form: any;
    @Input() topLevelForm: FormGroup;

    private stepName: string = 'stepInfo';
    private formGroup: FormGroup;

    constructor(private smsService: SmsService, private service: PromotionService) {
        this.smsService.getQuota()
            .subscribe(
                res => this.smsQuota = res,
                err => console.log(err)
            );
    }
    
    ngOnInit() {
        this.form = this.topLevelForm.controls[this.stepName];
        this.name.valueChanges.forEach(
            (value: string) => this.form.patchValue({
                details: this.buildSmsTemplate(value, this.percentage.value, this.dateFrom.value, this.dateTo.value)
            })
        );

        this.dateFrom.valueChanges.forEach(
            (value: any) => this.form.patchValue({
                details: this.buildSmsTemplate(this.name.value, this.percentage.value, value, this.dateTo.value)
            })
        );

        this.dateTo.valueChanges.forEach(
            (value: any) => this.form.patchValue({
                details: this.buildSmsTemplate(this.name.value, this.percentage.value, this.dateFrom.value, value)
            })
        );

        this.percentage.valueChanges.forEach(
            (value: string) => this.form.patchValue({
                details: this.buildSmsTemplate(this.name.value, value, this.dateFrom.value, this.dateTo.value)
            })
        );
    }

    getSmsCounter() {
        if (this.details.value == null) {
            this.details.patchValue('');
        }
        return SmsCounter.count(this.details.value);
    }

    smsQuotaValid() {
        var counter = this.getSmsCounter();
        if (counter != null && this.smsQuota != null && this.service.nbRecipients != null) {
            return counter.messages * this.service.nbRecipients <= this.smsQuota;
        }
        return true;
    }

    private buildSmsTemplate(name: string, percentage: string, dateFrom: any, dateTo: any): string {
        let dateString: string = '';
        let percentageString: string = '';
        if (name) {
            name = name + '\n';
        }

        if (percentage) {
            percentageString = this.smsPercentageTemplate.format(percentage);
        }

        if (dateFrom && dateTo) {
            let from: Date = new Date(dateFrom.year, dateFrom.month - 1, dateFrom.day);
            let to: Date = new Date(dateTo.year, dateTo.month - 1, dateTo.day);
            dateString = this.smsDateTemplate.format(from.toLocaleDateString(), to.toLocaleDateString());
        }
        return this.smsTemplate.format(name, this.smsSentence, percentageString, dateString);
    }
    
    get name() { return this.form.get('name'); }
    get dateFrom() { return this.form.get('dateFrom'); }
    get dateTo() { return this.form.get('dateTo'); }
    get percentage() { return this.form.get('percentage'); }
    get details() { return this.form.get('details'); }
}