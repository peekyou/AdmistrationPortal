import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { UserService } from '../../user/user.service';
import { ProductService } from '../../bo-management/product/product.service';
import { Product } from '../../bo-management/product/product';
import { Lookup } from '../../../core/models/lookup';
import { CustomerCustomFields } from '../../../core/models/customerCustomFields';
import { ngbDateStructToDate, validateAllFormFields } from '../../../core/helpers/utils';
import * as moment from 'moment';

@Component({
    selector: 'app-customer-form',
    styleUrls: ['./customer.form.scss'],
    templateUrl: './customer.form.html',
    providers: [NgbDatepickerConfig]
})
export class CustomerFormComponent implements OnInit {
    form: FormGroup;
    products: Product[];
    showLanguageCountries = ['ae'];
    showLanguages: boolean = false;
    showCurrentPoints = false;
    @Input() modal: boolean;
    @Input() isEdit: boolean;
    @Input() submitSubscription;
    @Output() onPopulate: EventEmitter<any> = new EventEmitter();
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();

    constructor(
        public user: UserService,
        private fb: FormBuilder, 
        private service: CustomerService, 
        private location: Location,
        private productService: ProductService,
        config: NgbDatepickerConfig) {
            this.showCurrentPoints = service.config.GroupId == 'B759313D190F4873B8F452F5F7498669';
            var currentDate = new Date();
            config.minDate = {year: 1900, month: 1, day: 1};
            config.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 2, day: currentDate.getDate() + 1};
            
            var cc = user.getCountryCode().toLowerCase();
            this.showLanguages = this.showLanguageCountries.indexOf(cc) > -1;
               
            productService.getProducts(null, null)
                .subscribe(
                    res => this.products = res.data,
                    err => console.log(err)
                );
    }
    
    ngOnInit() {
        this.init();
    }
    
    init() {
        this.form = this.fb.group({
            firstname: [null, Validators.required],
            lastname: [null, Validators.required],
            gender: [null, Validators.required],
            mobile: [null, Validators.required],
            email: [null, Validators.email],
            birthdate: [null, Validators.required],
            languages: this.fb.array([]),
            favoriteProducts: this.fb.array([]),
            address: this.fb.group({
                country: [null],
                addressLine1: [null],
                addressLine2: [null],
                state: [null],
                city: [null],
                area: [null],
                zipCode: [null],
                latitude: [null],
                longitude: [null]
            }),
            receiveSms: [true],
            comment: [null],
            currentPoints: [null, (c) => this.currentPointsValidator(c)],
            amount: [null, (c) => this.amountValidator(c)]
        });

        var languagesControl = <FormArray>this.form.controls.languages;
        languagesControl.push(new FormControl());
        
        var favProductsControl = <FormArray>this.form.controls.favoriteProducts;
        favProductsControl.push(new FormControl());

        // Add the custom controls before populating the form
        for (var i = 1; this.user.customerCustomFields && i <= this.user.customerCustomFields.length; i++) {
            this.user.showCustomControl(i, this.form);
        }
        this.onPopulate.emit(this.form);
    }

    addArrayControl(control: string) {
        const arrayControl = <FormArray>this.form.controls[control];
        let newControl = new FormControl();
        arrayControl.push(newControl);
    }

    removeControl(index: number, control: string) {
        const arrayControl = <FormArray>this.form.controls[control];
        arrayControl.removeAt(index);
    }
    
    submit() {
        if (this.form.valid) {
            var customer: Customer = {
                gender: this.form.value.gender,
                languages: this.form.value.languages,
                favoriteProducts: this.form.value.favoriteProducts,
                email: this.form.value.email,
                birthdate: ngbDateStructToDate(this.form.value.birthdate),
                mobileNumber: this.form.value.mobile,
                firstname: this.form.value.firstname,
                lastname: this.form.value.lastname,
                comment: this.form.value.comment,
                address: {
                    addressLine1: this.form.value.address.addressLine1,
                    addressLine2: this.form.value.address.addressLine2,
                    city: Lookup.getValue(this.form.value.address.city),
                    country: this.form.value.address.country,
                    area: Lookup.getValue(this.form.value.address.area),
                    zipCode: this.form.value.address.zipCode,
                    state: Lookup.getValue(this.form.value.address.state),
                    latitude: this.form.value.address.latitude,
                    longitude: this.form.value.address.longitude
                },
                customField1: CustomerCustomFields.getValue(this.form.value.customField1),
                customField2: CustomerCustomFields.getValue(this.form.value.customField2),
                customField3: CustomerCustomFields.getValue(this.form.value.customField3),
                customField4: CustomerCustomFields.getValue(this.form.value.customField4),
                currentPoints: this.form.value.currentPoints
            };
    
            if (!this.isEdit && this.form.value.amount) {
                customer.expenses = [{
                    date: new Date(),
                    localDate: moment().format("DD-MM-YYYY HH:mm:ss Z"),
                    amount: this.form.value.amount 
                }];
            }
            this.onSubmit.emit(customer);
        }
        else {
            validateAllFormFields(this.form);
        }
    }

    anyControlEmpty(control: string): boolean {
        var arrayControl = this.form.value[control];
        for (let i = 0; arrayControl && i < arrayControl.length; i++) {
            if (arrayControl[i] == null || arrayControl[i] == '') {
                return true;
            }
        }
        return false;
    }

    private customEmailValidator(control: AbstractControl): ValidationErrors {
        if (!control.value) {
            return null;
        }
        return Validators.email(control);
    }

    private currentPointsValidator(control: AbstractControl): ValidationErrors {
        if (this.isEdit || !this.showCurrentPoints) {
            return null;
        }
        return Validators.required(control);
    }

    private amountValidator(control: AbstractControl): ValidationErrors {
        if (this.isEdit) {
            return null;
        }
        return Validators.required(control);
    }

    // showCustomControl(index: number) {
    //     if (this.user.customerCustomFields && this.user.customerCustomFields.length > index - 1) {
    //         var control = this.form.get('customField' + index);
    //         var field = this.user.customerCustomFields[index - 1];
    //         if (!control && field) {
    //             this.form.addControl('customField' + index, new FormControl(field.multiselect ? [] : field.fieldType == 'checkbox' ? false : null, field.mandatory ? Validators.required : null));
    //             return true;
    //         }
    //         else if (control) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    
    get firstname() { return this.form.get('firstname'); }
    get lastname() { return this.form.get('lastname'); }
    get amount() { return this.form.get('amount'); }
    get currentPoints() { return this.form.get('currentPoints'); }
    get mobile() { return this.form.get('mobile'); }
    get email() { return this.form.get('email'); }
    get birthdate() { return this.form.get('birthdate'); }
    get gender() { return this.form.get('gender'); }
    get comment() { return this.form.get('comment'); }
    get customField1() { return this.form.get('customField1'); }
    get customField2() { return this.form.get('customField2'); }
    get customField3() { return this.form.get('customField3'); }
    get customField4() { return this.form.get('customField4'); }
}