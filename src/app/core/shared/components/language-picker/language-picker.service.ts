import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { LanguagePicker } from './language-picker';


@Injectable()
export class LanguagePickerService {
    private languages: LanguagePicker[];

    constructor(private http: HttpClient) { 
        
    }

    getLanguages(): Observable<LanguagePicker[]> {
        if (this.languages) {
            return Observable.of(this.languages);
        }

        return this.http.get('/assets/lang/languages.json')
            .map((res: any[]) => {
                this.languages = res.map<LanguagePicker>(c => new LanguagePicker(c.code, c.name));
                return this.languages;
            });
    }
}