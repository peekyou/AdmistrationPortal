import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

@Component({
    selector: 'app-customer-form',
    styleUrls: ['./customer.form.scss'],
    templateUrl: './customer.form.html'
})
export class CustomerForm implements OnInit {
    form: FormGroup;
    isEdit: boolean;
    @Input() submitSubscription;
    @Output() onPopulate: EventEmitter<any> = new EventEmitter();
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();

    constructor(
        private fb: FormBuilder, private service: CustomerService, private location: Location) {
    }
    
    ngOnInit() {
        this.isEdit = this.onPopulate.observers.length > 0;
        this.init();
    }
    
    init() {
        this.form = this.fb.group({
            firstname: [null, Validators.required],
            lastname: [null, Validators.required],
            gender: [null],
            mobile: [null, Validators.required],
            email: [null, this.customEmailValidator],
            languages: this.fb.array([]),
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
            mobileNumber: this.form.value.mobile,
            firstname: this.form.value.firstname,
            lastname: this.form.value.lastname,
            comment: this.form.value.comment
        };

        if (!this.isEdit && this.form.value.amount) {
            customer.expenses = [{ date: new Date(), amount: this.form.value.amount }];
        }
        this.onSubmit.emit(customer);
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
    get gender() { return this.form.get('gender'); }
    get comment() { return this.form.get('comment'); }
}