import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { Page, CallOption, WeekDay } from './page';
import { Lookup } from '../../core/models/lookup';
import { Picture } from '../../core/models/picture';
import { MerchantDesign } from '../../core/models/merchantDesign';

@Injectable()
export class ContentEditorService {
    private api: string;
    private weekDays: WeekDay[];
    private backgroundImageSizes: Lookup[];
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint + '/pages';
        this.weekDays = [
            { id: 1, name: 'Sunday' },
            { id: 2, name: 'Monday' },
            { id: 3, name: 'Tuesday' },
            { id: 4, name: 'Wednesday' },
            { id: 5, name: 'Thursday' },
            { id: 6, name: 'Friday' },
            { id: 7, name: 'Saturday' }
        ];

        this.backgroundImageSizes = [
            { id: '100% 100%', name: '100% width and height' },
            { id: '100% auto', name: '100% width only' },
            { id: 'auto 100%', name: '100% height only' },
            { id: 'auto', name: 'Auto' }
        ];
    }

    getPages(): Observable<Page[]> {
        return this.http.get(this.api);
    }

    getDesign(): Observable<MerchantDesign> {
        return this.http.get(this.config.ApiEndpoint + '/merchants/design');
    }

    getBackgroundImageSizes(): Observable<Lookup[]> {
        return Observable.of(this.backgroundImageSizes);
    }

    getWeekDays(): Observable<WeekDay[]> {
        return Observable.of(this.weekDays);
    }
       
    deletePage(page: Page): Observable<void> {
        return this.http.delete(this.api + '/' + page.id);
    }

    saveDesign(design: MerchantDesign): Observable<void> {
        return this.http.post(this.config.ApiEndpoint + '/merchants/design', design);
    }

    savePage(page: Page): Observable<string> {
        return this.http.post(this.api, page);
    }

    uploadFile(file: Picture, pageId: string): Observable<string> {
        return this.http.post(this.config.ApiEndpoint + '/documents/upload', file);
    }

    deleteFile(file: Picture): Observable<string> {
        return this.http.delete(this.config.ApiEndpoint + '/documents/' + file.id);
    }

    getFilesSize(): Observable<number> {
        return this.http.get(this.config.ApiEndpoint + '/documents/size');
    }
}