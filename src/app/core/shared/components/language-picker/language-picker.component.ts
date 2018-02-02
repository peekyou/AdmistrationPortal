import { Component, Input, Output, OnInit, ViewChild, EventEmitter, forwardRef  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectControlValueAccessor, NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

import { CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent } from "ng-auto-complete";
import { TranslationService } from '../../../services/translation.service';
import { LanguagePickerService } from './language-picker.service';
import { LanguagePicker } from './language-picker';

@Component({
    selector: 'app-language-picker',
    templateUrl: './language-picker.component.html',
    styleUrls: ['./language-picker.component.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => LanguagePickerComponent),
        multi: true,
      }
    ]
})
export class LanguagePickerComponent implements OnInit, ControlValueAccessor {
    public languages: any[];
    private _language;
    private onTouchedCallback: () => {};
    private onChangeCallback: (_:any) => {};

    @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;  
    
    get language() {
        return this._language;
    }
    
    set language(val) {
        if (this._language !== val) {
            this._language = val;
            this.onChangeCallback(val);
            
            if (this.onTouchedCallback) {
                this.onTouchedCallback();
            }
        }
    }
    
    constructor(
        private http: HttpClient, 
        private translation: TranslationService,
        private languageService: LanguagePickerService) { }

    ngOnInit() {
        // Init the countries list
        this.translation.get('COMMON.AUTOCOMPLETE_PLACEHOLDER', x => {
            this.languages = [
                CreateNewAutocompleteGroup(x, 'completer', [], { titleKey: 'name', childrenKey: null }),
            ];

            this.languageService.getLanguages().subscribe(languages => {
                this.completer.SetValues('completer', languages);
                if (this._language) {
                    this.completer.SelectItem('completer', this._language);
                }
            });
        });
    }

    onLanguageSelected(group: SelectedAutocompleteItem) {
        if (group.item) {
            this.language = group.item.id;
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: any) { 
        this._language = value;
        this.completer.SelectItem('completer', this._language);
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}