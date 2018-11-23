import { Component, OnInit, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, FormControl, AbstractControl } from "@angular/forms";
import { FormGroup, FormArray } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

import { CustomerCustomFields } from '../../../models/customerCustomFields';

@Component({
    selector: 'app-dynamic-field',
    templateUrl: './dynamic-field.component.html',
    styleUrls: ['./dynamic-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DynamicFieldComponent),
            multi: true,
        }
    ],    
})
export class DynamicFieldComponent implements OnInit, ControlValueAccessor {
    multiSelectSettings: IMultiSelectSettings = {
        enableSearch: false,
        ignoreLabels: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'multi-form-control multi-form-control-sm',
        dynamicTitleMaxItems: 2,
        displayAllSelectedText: true,
        showCheckAll: true,
        showUncheckAll: true
    };
    multiSelectTexts: IMultiSelectTexts; 
    options: IMultiSelectOption[] = [];

    private checkboxValue = true;
    private fieldName: string;
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
            if (this.field.valuesList && this.field.valuesList.length > 0) {
                this.options = this.field.valuesList.map(option => {
                    return { id: option, name: option };
                });
            }
        }

        if (this.field.multiselect && this.formControl && this.formControl.value && this.formControl.value.split) {
            var values = this.formControl.value.split(';');
            // for (let i = 0; i < values.length; i++) {
            //      var c = new FormControl(values[i]);
            //      (<FormArray>this.formControl).push(c);
            // }
        }

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