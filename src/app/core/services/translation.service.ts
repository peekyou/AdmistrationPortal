import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class TranslationService {
    private translations;

    constructor(private translate: TranslateService) { 
        this.initStrings();
    }

    initStrings() {
        this.translate
            .get([
                ''
            ])
            .subscribe((res: string) => {
                console.log(res);
            });
    }
}