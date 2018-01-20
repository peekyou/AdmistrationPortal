import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent } from "ng-auto-complete";
import { TranslationService } from '../../../services/translation.service';
import { CountrySelectService } from './country-select.service';
import { CountrySelect } from './country-select';

@Component({
    selector: 'app-country-select',
    templateUrl: './country-select.component.html',
    styleUrls: ['./country-select.component.scss']
})
export class CountrySelectComponent implements OnInit {
    countries: any[];
    selectedCountry;

    // @Output() onSelected: EventEmitter<string | number> = new EventEmitter();
    @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;  
    @Output() countryChange = new EventEmitter();
    
    @Input()
    get country() {
        return this.selectedCountry;
    }
    
    set country(val) {
        if (!this.selectedCountry) {
            this.completer.SelectItem('completer', val);
        }
        else {
            this.countryChange.emit(val);
        }
        this.selectedCountry = val;
    }
    
    constructor(
        private http: HttpClient, 
        private translation: TranslationService,
        private countryService: CountrySelectService) { }

    ngOnInit() {
        // Init the countries list
        this.translation.get('COMMON.COUNTRY_PLACEHOLDER', x => {
            this.countries = [
                CreateNewAutocompleteGroup(x, 'completer', [], { titleKey: 'name', childrenKey: null }),
            ];

            this.countryService.getCountries().subscribe(countries => {
                this.completer.SetValues('completer', countries);
                if  (this.selectedCountry) {
                    this.completer.SelectItem('completer', this.selectedCountry);
                }
            });
        });
    }

    onCountrySelected(group: SelectedAutocompleteItem) {
        this.country = group.item.id;
    }
}