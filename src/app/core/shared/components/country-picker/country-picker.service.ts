import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { CountryPicker } from './country-picker';


@Injectable()
export class CountryPickerService {
    private countries: CountryPicker[];

    constructor(private http: HttpClient) { 
        
    }

    getCountries(): Observable<CountryPicker[]> {
        if (this.countries) {
            return Observable.of(this.countries);
        }

        return this.http.get('/assets/lang/countries.json')
            .map((res: any[]) => {
                this.countries = res.map<CountryPicker>(c => new CountryPicker(c.cca2, c.name.common));
                return this.countries;
            });
    }
}