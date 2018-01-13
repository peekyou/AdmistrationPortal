import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Promotion, PromotionFilter } from '../../promotion';
import { PromotionService } from '../../promotion.service';

@Component({
    selector: 'promotion-filter',
    styleUrls: ['./promotion-filter.component.scss'],
    templateUrl: './promotion-filter.component.html'
})
export class PromotionFilterComponent implements OnInit {
    form: any;
    promotions: Promotion[];
    searchStr;
    nbCustomers: number;
    @Input() topLevelForm: FormGroup;

    private stepName: string = 'stepFilter';
    private formGroup: FormGroup;

    constructor(private service: PromotionService) {
    }
    
    ngOnInit() {
        this.form = this.topLevelForm.controls[this.stepName];
        this.form.valueChanges.subscribe(data => {
            this.filterCustomers(data);
        });

        this.getPromotions();
        this.filterCustomers(null);
    }

    getPromotions() {
        this.service
            .getAll()
            .subscribe(promotions => {
                if (promotions && promotions.paging.itemsCount > 0) {
                    this.promotions = [...promotions.data]; // clone the array
                    if (this.promotions[0].id !== '') {
                        this.promotions.unshift({ id: '', name: '' });
                    }
                }
            },
            err => { console.log(err); });
    }

    filterCustomers(form: any) {
        let filter = PromotionFilter.createFromForm(form);
        this.service
            .customerCount(filter).subscribe(c => {
                this.nbCustomers = c;
            },
            err => { console.log(err); });
    }

    details() {

    }
}