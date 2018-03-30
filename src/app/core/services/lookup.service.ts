import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Lookup } from '../models/lookup';

@Injectable()
export class LookupService {
    private countries: Lookup[];
    private languages: Lookup[];

    constructor(private http: HttpClient) { 
        this.initLookups();
    }

    initLookups() {
        this.fetchCountries();
        this.fetchLanguages();
    }

    fetchCountries(): Observable<Lookup[]> {
        if (this.countries) {
            return Observable.of(this.countries);
        }
        return this.http.get('/assets/lang/countries.json')
            .map((res: any[]) => {
                return this.countries = res.map<Lookup>(c => new Lookup(c.cca2, c.name.common));
            });
    }

    fetchLanguages(): Observable<Lookup[]> {
        if (this.languages) {
            return Observable.of(this.languages);
        }
        return this.http.get('/assets/lang/languages.json')
            .map((res: any[]) => {
                return this.languages = res.map<Lookup>(c => new Lookup(c.code, c.name));
            });
    }
}