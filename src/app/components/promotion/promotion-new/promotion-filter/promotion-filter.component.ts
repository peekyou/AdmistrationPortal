import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TranslationService } from '../../../../core/services/translation.service';
import { Promotion, PromotionFilter } from '../../promotion';
import { PromotionService } from '../../promotion.service';
import { CustomerService } from '../../../customer/customer.service';
import { Lookup } from '../../../../core/models/lookup';

@Component({
    selector: 'promotion-filter',
    styleUrls: ['./promotion-filter.component.scss'],
    templateUrl: './promotion-filter.component.html'
})
export class PromotionFilterComponent implements OnInit {
    form: any;
    promotions: Promotion[];
    searchStr;
    nbRecipients: number;
    totalNbCustomers: number;
    @Input() topLevelForm: FormGroup;

    private stepName: string = 'stepFilter';
    private formGroup: FormGroup;

    constructor(
        private service: PromotionService, 
        private customerService: CustomerService,
        private translation: TranslationService) {

        customerService.getCount()
        .subscribe(
            res => this.totalNbCustomers = res,
            err => console.log(err)
        );
    }
        
    ngOnInit() {
        this.form = this.topLevelForm.controls[this.stepName];
        this.form.valueChanges.subscribe(data => {
            this.filterCustomers(data);
        });

        this.getCities();
        this.getPromotions();
        this.filterCustomers(null);

        // this.dropdownList = [
        //     {"id":1,"name":"India"},
        //     {"id":2,"itemName":"Singapore"},
        //     {"id":3,"itemName":"Australia"},
        //     {"id":4,"itemName":"Canada"},
        //     {"id":5,"itemName":"South Korea"},
        //     {"id":6,"itemName":"Germany"},
        //     {"id":7,"itemName":"France"},
        //     {"id":8,"itemName":"Russia"},
        //     {"id":9,"itemName":"Italy"},
        //     {"id":10,"itemName":"Sweden"}
        //   ];

        this.translation.getMultiple([
            'PROMOTIONS.SELECT_CITIES',
            'COMMON.SELECT_ALL',
            'COMMON.UNSELECT_ALL'], x => {
                this.dropdownSettings = { 
                    singleSelection: false, 
                    text: x['PROMOTIONS.SELECT_CITIES'],
                    selectAllText: x['COMMON.SELECT_ALL'],
                    unSelectAllText: x['COMMON.UNSELECT_ALL'],
                    enableSearchFilter: true,
                    labelKey: "name",
                    classes: "multi-drop-down-sm"
                };      
        });
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

    getCities() {
        this.customerService.getCustomerCities()
            .subscribe(
                cities => this.citiesList = cities,
                err => { console.log(err); 
            });
    }

    filterCustomers(form: any) {
        let filter = PromotionFilter.createFromForm(form);
        this.service
            .customerCount(filter).subscribe(c => {
                this.nbRecipients = c;
                this.topLevelForm.get('stepInfo').get('nbRecipients').patchValue(c);
            },
            err => { console.log(err); });
    }

    // Cities multi select
    citiesList: Lookup[] = [];
    selectedCities = [];
    dropdownSettings = {};

    onItemSelect(item:any){
        console.log(item);
    }
    OnItemDeSelect(item:any){
        console.log(item);
    }
    onSelectAll(items: any){
        console.log(items);
    }
    onDeSelectAll(items: any){
        console.log(items);
    }
}