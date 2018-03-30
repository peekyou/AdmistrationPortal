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
            this._onChangeCallback(value);
            this.onChange.emit(this._selectedValue);
        }
        this._onTouchedCallback();
    }

    @Input() openOnFocus: boolean = false;
    @Input() small: boolean = false;
    @Input() source: string;
    @Output() onChange: EventEmitter<Lookup> = new EventEmitter(); 
    values: Lookup[] = [];
    
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
               .map(term => (term === '' ? this.values : this.values.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10));
            
        }
        else {
            this.search = (text$: Observable<string>) =>
              text$
                .debounceTime(200).distinctUntilChanged()
                .map(term => (term === '' ? this.values : this.values.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10));
        }
        
        switch(this.source) {
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
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value != null && value.id) {
            var lookup = this.findLookupById(value.id);
            if (lookup != null) {
                this._selectedValue = lookup;
            }
            else if (value && value.id) {
                this._selectedValue = new Lookup(value.id, value.name)
            }
        }
        else {
            this._selectedValue = value;
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
        // The [required] validator will check presence
        if (!control.value) {
            return null;
        }

        var isValid = false;
        if (control.value.name) {
            isValid = this.findLookupByName(control.value.name) != null;
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
        var filter = this.values.filter(o => {
            return o.name.toUpperCase() == name.toUpperCase();
        });
        if (filter.length == 1) {
            return filter[0];
        }
        return null;
    }

    checkValue() {
        if (this._selectedValue && this._selectedValue.id && !this._selectedValue.name) {
            this._selectedValue = this.findLookupById(this._selectedValue.id);
        }
    }
}