import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Lookup } from '../models/lookup';

@Injectable()
export class LookupService {
    private countries: Lookup[];
    private languages: Lookup[];
    private statesByCountry: any = {};
    private citiesByCountry: any = {};
    private areasByCountry: any = {};
    
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

    fetchStates(countryCode: string): Observable<Lookup[]> {
        if (this.statesByCountry && this.statesByCountry[countryCode]) {
            return Observable.of(this.statesByCountry[countryCode]);
        }
        return this.http.get('/assets/lang/states/' + countryCode + '.json')
            .map((res: any[]) => {
                return this.statesByCountry[countryCode] = res.map<Lookup>(c => new Lookup(c.id, c.name));
            });
    }

    fetchCities(countryCode: string): Observable<Lookup[]> {
        if (this.citiesByCountry && this.citiesByCountry[countryCode]) {
            return Observable.of(this.citiesByCountry[countryCode]);
        }
        return this.http.get('/assets/lang/cities/' + countryCode + '.json')
            .map((res: any[]) => {
                return this.citiesByCountry[countryCode] = res.map<Lookup>(c => {
                    var id = c.id ? c.id : c.name;
                    var name = c.zipcode ? c.zipcode + ' - ' + c.name : c.name;
                    return new Lookup(id, name, c.parent);
                });
            });
    }

    fetchAreas(countryCode: string): Observable<Lookup[]> {
        if (this.areasByCountry && this.areasByCountry[countryCode]) {
            return Observable.of(this.areasByCountry[countryCode]);
        }
        return this.http.get('/assets/lang/areas/' + countryCode + '.json')
            .map((res: any[]) => {                    
                return this.areasByCountry[countryCode] = res.map<Lookup>(c => new Lookup(c.id, c.name, c.parent));
            });
    }
}