import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { CountrySelect } from './country-select';


@Injectable()
export class CountrySelectService {
    private countries: CountrySelect[];

    constructor(private http: HttpClient) { 
        
    }

    getCountries(): Observable<CountrySelect[]> {
        if (this.countries) {
            return Observable.of(this.countries);
        }

        return this.http.get('/assets/lang/countries.json')
            .map((res: any[]) => {
                this.countries = res.map<CountrySelect>(c => new CountrySelect(c.cca2, c.name.common));
                return this.countries;
            });
    }
}