import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';

import { Lookup } from '../models/lookup';

@Injectable()
export class LookupService {
    public countries: Lookup[];
    public languages: Lookup[];

    constructor(private http: HttpClient) { 
        this.initLookups();
    }

    initLookups() {
        this.fetchCountries();
        this.fetchLanguages();
    }

    fetchCountries() {
        this.http.get('/assets/lang/countries.json')
            .subscribe((res: any[]) => {
                this.countries = res.map<Lookup>(c => new Lookup(c.cca2, c.name.common));
            });
    }

    fetchLanguages() {
        this.http.get('/assets/lang/languages.json')
            .subscribe((res: any[]) => {
                this.languages = res.map<Lookup>(c => new Lookup(c.code, c.name));
            });
    }
}