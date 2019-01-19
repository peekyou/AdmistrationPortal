import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

import { TranslationService } from '../../../../core/services/translation.service';
import { Promotion, PromotionFilter } from '../promotion';
import { PromotionService } from '../promotion.service';
import { CustomerService } from '../../../customer/customer.service';
import { UserService } from '../../../user/user.service';
import { Lookup } from '../../../../core/models/lookup';

@Component({
    selector: 'promotion-filter',
    styleUrls: ['./promotion-filter.component.scss'],
    templateUrl: './promotion-filter.component.html'
})
export class PromotionFilterComponent implements OnInit {
    form: any;
    infoForm: any;
    promotions: Promotion[];
    searchStr;
    nbRecipients: number;
    totalNbCustomers: number;
    anyCustomField = false;
    currentFilter: PromotionFilter;

    @Input() topLevelForm: FormGroup;
    @Input() campaignType: string;

    private stepName: string = 'stepFilter';

    constructor(
        private service: PromotionService, 
        private customerService: CustomerService,
        private translation: TranslationService,
        public user: UserService) {

        customerService.getCount()
            .subscribe(
                res => this.totalNbCustomers = res,
                err => console.log(err)
            );

        this.getCities();
        this.getPromotions();
    }
        
    ngOnInit() {
        this.form = this.topLevelForm.controls[this.stepName];
        this.form.valueChanges.subscribe(data => this.filterCustomers(data));

        this.translation.getMultiple([
            'CUSTOMERS.SEARCH_BTN',
            'PROMOTIONS.SELECT_LOCATION',
            'COMMON.SELECT_ALL',
            'COMMON.UNSELECT_ALL',
            'COMMON.ALL_SELECTED',
            'COMMON.ITEMS_SELECTED'], x => {
                
                this.multiSelectTexts = {
                    checkAll: x['COMMON.SELECT_ALL'],
                    uncheckAll: x['COMMON.UNSELECT_ALL'],
                    checked: x['COMMON.ITEMS_SELECTED'],
                    checkedPlural: x['COMMON.ITEMS_SELECTED'],
                    searchPlaceholder: x['CUSTOMERS.SEARCH_BTN'],
                    searchEmptyResult: 'Nothing found...',
                    searchNoRenderText: 'Type in search box to see results...',
                    defaultTitle: x['PROMOTIONS.SELECT_LOCATION'],
                    allSelected: x['COMMON.ALL_SELECTED'],
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
                cities => {
                    this.locations = <IMultiSelectOption[]>cities;
                    // Issue of the dropdown module. If parent is null, unchek does not work properly
                    this.locations.forEach(x => x.parentId = x.parentId ? x.parentId : undefined);
                },
                err => { console.log(err); 
            });
    }

    filterCustomers(form: any) {
        if (form) {
            this.currentFilter = PromotionFilter.createFromForm(form);
        }
        this.service
            .customerCount(this.currentFilter, this.campaignType).subscribe(c => {
                this.nbRecipients = this.service.nbRecipients = c;
                this.topLevelForm.get('stepInfo').get('nbRecipients').patchValue(c);
            },
            err => { console.log(err); });
    }

    get customField1() { return this.form.get('customField1'); }
    get customField2() { return this.form.get('customField2'); }
    get customField3() { return this.form.get('customField3'); }
    get customField4() { return this.form.get('customField4'); }

    // Cities multi select
    multiSelectSettings: IMultiSelectSettings = {
        enableSearch: false,
        ignoreLabels: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'multi-form-control multi-form-control-sm',
        dynamicTitleMaxItems: 3,
        displayAllSelectedText: true,
        showCheckAll: true,
        showUncheckAll: true
    };
    
    // Text configuration
    multiSelectTexts: IMultiSelectTexts; 
    locations: IMultiSelectOption[] = [];
}