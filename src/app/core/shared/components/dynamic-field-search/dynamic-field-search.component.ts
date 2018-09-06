import { Component, OnInit, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, FormControl, AbstractControl } from "@angular/forms";
import { FormGroup, FormArray } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

import { CustomerCustomFields } from '../../../models/customerCustomFields';
import { Lookup } from '../../../models/lookup';
import { UserService } from '../../../../components/user/user.service';

@Component({
    selector: 'app-dynamic-field-search',
    templateUrl: './dynamic-field-search.component.html',
    styleUrls: ['./dynamic-field-search.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DynamicFieldSearchComponent),
            multi: true,
        }
    ],    
})
export class DynamicFieldSearchComponent implements OnInit, ControlValueAccessor {
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
    multiSelectTexts: IMultiSelectTexts; 
    options: IMultiSelectOption[] = [];

    public fieldName: string;
    private _value: string;
    private _onTouchedCallback: () => {};    
    private _onChangeCallback: (_: any) => {};
    @Input() formControl: AbstractControl;
    @Input() field: CustomerCustomFields;

    @Input()
    get value(): string {
        return this._value;
    }
    set value(value: string) {
        this._value = value;
        if (this._onChangeCallback) {
            this._onChangeCallback(value);
        }
        if (this._onTouchedCallback) {
            this._onTouchedCallback();
        }
    }
    
    constructor() {
    }

    ngOnInit() {
        if (this.field) {
            if (!this.fieldName) {
                this.fieldName = 'customField' + this.field.order;
            }
            if (this.field.fieldType == 'checkbox') {
                // Set the undefined value by default
                this.formControl.setValue('');
            }
            if (this.field.valuesList && this.field.valuesList.length > 0) {
                this.options = this.field.valuesList.map(option => {
                    return { id: option, name: option };
                });
            }
        }
    }

    showMultiSelect(): boolean {
        return this.field.valuesList && this.field.valuesList.length > 0 &&
            (this.field.multiselect ||
            this.field.fieldType == 'select' ||
            this.field.fieldType == 'autocomplete' ||
            (this.field.fieldType == 'radio' /*&& this.field.valuesList && this.field.valuesList.length > 2*/));
    }

    onBlur() {
        if (this._onTouchedCallback) {
            this._onTouchedCallback();
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: string) {
        this._value = value;
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }
}