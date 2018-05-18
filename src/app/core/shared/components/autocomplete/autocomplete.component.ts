import { Component, OnInit, forwardRef, Input, Output, OnChanges, ViewChild, EventEmitter } from '@angular/core';
import { FormControl, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { LookupService } from '../../../services/lookup.service';
import { Lookup } from '../../../models/lookup';

@Component({
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    providers: [
      { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AutoCompleteComponent), multi: true },
      { provide: NG_VALIDATORS, useExisting: forwardRef(() => AutoCompleteComponent), multi: true }
    ]
})
export class AutoCompleteComponent implements OnInit, ControlValueAccessor, Validator {
    values: Lookup[] = [];
    private _parent: Lookup;
    private _source: any = [];
    private _selectedValue: any = '';
    private _onTouchedCallback: () => {};
    private _onChangeCallback: (_:any) => {};

    get selectedValue(): any {
        return this._selectedValue;
    }

    set selectedValue(value: any) {
        // While searching try to find 
        if (typeof value === 'string') {
            var lookup = this.findLookupByName(value);
            if (lookup != null) {
                value = lookup;
            }
        }

        if (value !== this._selectedValue) {
            this._selectedValue = value;
            if (this._onChangeCallback) {
                this._onChangeCallback(value);
            }
            this.onChange.emit(this._selectedValue);
        }

        if (this._onTouchedCallback) {
            this._onTouchedCallback();
        }
    }

    @Input() required: boolean = false;
    @Input() openOnFocus: boolean = false;
    @Input() small: boolean = false;
    @Input() limit: number = 10;
    @Output() onChange: EventEmitter<Lookup> = new EventEmitter(); 
    
    @Input() 
    set source(source: any) {
        this._source = source;
        var lang = null;
        if (typeof source == 'string' && source.indexOf('-') > -1) {
            lang = (<string>source).split('-')[1].toLowerCase();
            source = (<string>source).split('-')[0];
        }

        switch(source) {
            case 'countries': this.lookupService.fetchCountries().subscribe(res => {
                    this.values = res
                    this.checkValue();
                });
                break;
            case 'languages': this.lookupService.fetchLanguages().subscribe(res => {
                    this.values = res;
                    this.checkValue();
                });
                break;
            case 'areas': this.lookupService.fetchAreas(lang).subscribe(res => {
                    this.values = res;
                    this.checkValue();
                });
                break;
            case 'cities': this.lookupService.fetchCities(lang).subscribe(res => {
                    this.values = res;
                    this.checkValue();
                });
                break;
            case 'states': this.lookupService.fetchStates(lang).subscribe(res => {
                    this.values = res;
                    this.checkValue();
                });
                break; 
            default: this.values = source || [];
        }
    }

    get source(): any {
        return this._source;
    }

    @Input() 
    set parent(parent: Lookup) {
        this._parent = parent;
    }

    get parent(): Lookup {
        return this._parent;
    }
    
    @ViewChild('instance') instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();
    search;

    formatMatches = (value: Lookup) => value.name || '';
    constructor(private lookupService: LookupService) { }

    ngOnInit() {
        if (this.openOnFocus) {
           this.search = (text$: Observable<string>) =>
              text$
               .debounceTime(200).distinctUntilChanged()
               .merge(this.focus$)
               .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
               .map(term => (term === '' ? this.getValues() : this.getValues().filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, this.limit));
            
        }
        else {
            this.search = (text$: Observable<string>) =>
              text$
                .debounceTime(200).distinctUntilChanged()
                .map(term => (term === '' ? this.getValues() : this.getValues().filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, this.limit));
        }
    }

    getValues() {
        if (this.parent && this.parent.id) {
            return this.values.filter(v => v.parentId === this.parent.id);
        }
        return this.values;
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value != null && value.id) {
            var lookup = this.findLookupById(value.id);
            this._selectedValue = lookup ? lookup : new Lookup(value.id, value.name);
        }
        else if (value) {
            var lookup = this.findLookupByName(value);
            this._selectedValue = lookup ? lookup : new Lookup(value, value);
        }
        else {
            this._selectedValue = null;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    // validates the form, returns null when valid else the validation object
    // in this case we're checking if the json parsing has passed or failed from the onChange method
    validate(control: FormControl) {
        var isValid = false;
        var values = this.getValues();
        if ((!control.value || !values || values.length === 0) && !this.required) {
            isValid = true;
        }
        else {
            // Use the selected value if control value is not a Lookup
            // Useful when the value patched in the control is a string, but selectedValue is a Lookup
            // (from writeValue function) 
            var val = control && control.value && control.value.id ? control.value : this._selectedValue;
            if (val && val.id) {
                isValid = this.findLookupById(val.id) != null;
            }
        }
        if (!isValid) {
            return {
                selectedValue: {
                    valid: false,
                }
            };
        }
    }

    findLookupById(id: string): Lookup {
        var filter = this.values.filter(o => {
            return o.id.toUpperCase() == id.toUpperCase();
        });
        if (filter.length > 0) {
            return filter[0];
        }
        return null;
    }

    findLookupByName(name: string): Lookup {
        if (name) {
            var filter = this.values.filter(o => {
                return o.name.toUpperCase() == name.toUpperCase();
            });
            if (filter.length == 1) {
                return filter[0];
            }
        }
        return null;
    }

    checkValue() {
        if (this._selectedValue && this._selectedValue.id && !this._selectedValue.name) {
            this._selectedValue = this.findLookupById(this._selectedValue.id);
        }
    }
}