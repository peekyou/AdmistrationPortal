import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class TranslationService {
    private translations: any;

    constructor(private translate: TranslateService) { 
        this.initStrings();
    }

    private initStrings() {
        this.translate
            .get([
                'LOGIN.INVALID_CREDENTIALS',
                'COMMON.AUTOCOMPLETE_PLACEHOLDER'
            ])
            .subscribe(res => {
                this.translations = res;
            });
    }

    public get(name: string, callback: (data: string) => void) {
        if (this.translations) {
            callback(this.translations[name]);
        }
        return this.translate.get(name).subscribe(res => {
            callback(res);
        });;
    }

    public getMultiple(names: string[], callback: (data: any) => void) {
        if (this.translations) {
            var res = {};
            names.forEach(n => {
                res[n] = this.translations[n];
            })
            callback(res);
        }
        return this.translate.get(names).subscribe(res => {
            callback(res);
        });;
    }
}