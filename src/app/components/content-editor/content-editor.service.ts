import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthHttpService } from '../../core/services/auth-http.service';
import { Page, CallOption, WeekDay } from './page';
import { Picture } from '../../core/shared/components/file-upload/picture';
import { AppSettings } from '../../app.settings';

@Injectable()
export class ContentEditorService {
    private api = AppSettings.API_ENDPOINT + '/pages';
    private pages: Page[];
    private callOptions: CallOption[];
    private weekDays: WeekDay[];

    constructor(private http: AuthHttpService) {
        this.callOptions = [
            { id: '1', label: 'Book' },
            { id: '2', label: 'Order' },
            { id: '3', label: 'Call' },
            { id: '4', label: 'Take an appointment' },
            { id: '5', label: 'Request informations' },
        ];

        this.weekDays = [
            { id: 1, name: 'Sunday' },
            { id: 2, name: 'Monday' },
            { id: 3, name: 'Tuesday' },
            { id: 4, name: 'Wednesday' },
            { id: 5, name: 'Thursday' },
            { id: 6, name: 'Friday' },
            { id: 7, name: 'Saturday' }
        ];
    }

    getPages(): Observable<Page[]> {
        return this.http.get(this.api)
            .map((response: any) => {
                this.pages = response;
                return response;
            });
    }

    getCallOptions(): Observable<CallOption[]> {
        return Observable.of(this.callOptions);
    }

    getWeekDays(): Observable<WeekDay[]> {
        return Observable.of(this.weekDays);
    }
       
    deletePage(page: Page): Observable<void> {
        return this.http.delete(this.api + '/' + page.id);
    }

    savePage(page: Page): Observable<Page> {
        return this.http.post(this.api, page);
    }

    uploadFile(file: Picture, pageId: string): Observable<string> {
        return this.http.post(AppSettings.API_ENDPOINT + '/documents/upload', {
            data: file.src,
            name: file.name,
            pageId: pageId,
            size: file.size
        });
    }

    deleteFile(file: Picture): Observable<string> {
        return this.http.delete(AppSettings.API_ENDPOINT + '/documents/' + file.id);
    }

    getFilesSize(): Observable<number> {
        return this.http.get(AppSettings.API_ENDPOINT + '/documents/size');
    }
}