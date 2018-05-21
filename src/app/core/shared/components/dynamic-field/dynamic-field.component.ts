import { Component, OnInit, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, FormControl, AbstractControl } from "@angular/forms";
import { FormGroup } from '@angular/forms';

import { CustomerCustomFields } from '../../../models/customerCustomFields';
import { Lookup } from '../../../models/lookup';
import { UserService } from '../../../../components/user/user.service';

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
    private _value: string;
    private _onTouchedCallback: () => {};    
    private _onChangeCallback: (_: any) => {};
    @Input() formControl: AbstractControl;    

    @Input() resourceKey: string;
    @Input() values: string[];

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