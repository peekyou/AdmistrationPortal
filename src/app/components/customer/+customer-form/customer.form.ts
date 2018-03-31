import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { ngbDateStructToDate } from '../../../core/helpers/utils';

@Component({
    selector: 'app-customer-form',
    styleUrls: ['./customer.form.scss'],
    templateUrl: './customer.form.html',
    providers: [NgbDatepickerConfig]
})
export class CustomerForm implements OnInit {
    form: FormGroup;
    @Input() modal: boolean;
    @Input() isEdit: boolean;
    @Input() submitSubscription;
    @Output() onPopulate: EventEmitter<any> = new EventEmitter();
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();

    constructor(
        private fb: FormBuilder, 
        private service: CustomerService, 
        private location: Location,
        config: NgbDatepickerConfig) {
            var currentDate = new Date();
            config.minDate = {year: 1900, month: 1, day: 1};
            config.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 2, day: currentDate.getDate() + 1};
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
            email: [null, this.customEmailValidator],
            birthdate: [null],
            languages: this.fb.array([]),
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
            amount: [null, (c) => this.AmountValidator(c)]
        });

        var languagesControl = <FormArray>this.form.controls.languages;
        languagesControl.push(new FormControl());
        this.onPopulate.emit(this.form);
    }

    addLanguage() {
        const arrayControl = <FormArray>this.form.controls.languages;
        let newLanguage = new FormControl();
        arrayControl.push(newLanguage);
    }

    removeLanguage(index: number) {
        const arrayControl = <FormArray>this.form.controls.languages;
        arrayControl.removeAt(index);
    }
    
    submit() {
        var customer: Customer = {
            gender: this.form.value.gender,
            languages: this.form.value.languages,
            email: this.form.value.email,
            birthdate: ngbDateStructToDate(this.form.value.birthdate),
            mobileNumber: this.form.value.mobile,
            firstname: this.form.value.firstname,
            lastname: this.form.value.lastname,
            comment: this.form.value.comment,
            address: {
                addressLine1: this.form.value.address.addressLine1,
                addressLine2: this.form.value.address.addressLine2,
                city: this.form.value.address.city,
                country: this.form.value.address.country,
                area: this.form.value.address.area,
                zipCode: this.form.value.address.zipCode,
                state: this.form.value.address.state,
                latitude: this.form.value.address.latitude,
                longitude: this.form.value.address.longitude
            }
        };

        if (!this.isEdit && this.form.value.amount) {
            customer.expenses = [{ date: new Date(), amount: this.form.value.amount }];
        }
        this.onSubmit.emit(customer);
    }

    anyLanguageEmpty(): boolean {
        var languages = this.form.value.languages;
        for (let i = 0; languages && i < languages.length; i++) {
            if (languages[i] == null || languages[i] == '') {
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

    private AmountValidator(control: AbstractControl): ValidationErrors {
        if (this.isEdit) {
            return null;
        }
        return Validators.required(control);
    }

    get firstname() { return this.form.get('firstname'); }
    get lastname() { return this.form.get('lastname'); }
    get amount() { return this.form.get('amount'); }
    get mobile() { return this.form.get('mobile'); }
    get email() { return this.form.get('email'); }
    get birthdate() { return this.form.get('birthdate'); }
    get gender() { return this.form.get('gender'); }
    get comment() { return this.form.get('comment'); }
}