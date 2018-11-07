import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RequestArgs } from "@angular/http/src/interfaces";
import { Observable } from 'rxjs/Observable';
import { saveAs } from 'file-saver';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpService {
    protected headers: any;

    constructor(private http: HttpClient) {
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    get(url: string, token: string = null): Observable<any> {
        if (token) {
            this.headers['Authorization'] = 'Bearer ' + token;
        }

        return this.http.get(url, { headers: this.headers })
            .catch(this.handleError);
    }

    download(url: string, token: string = null): Observable<any> {
        if (token) {
            this.headers['Authorization'] = 'Bearer ' + token;
        }

        return this.http.get(url, { headers: this.headers, responseType: 'blob', observe: 'response' })
            .map(res => {
                var fileName = null;
                var contentDisposition = res.headers.get('Content-Disposition');
                if (contentDisposition) {
                    fileName = contentDisposition.split('=')[1];
                }
                return saveAs(res.body, fileName);
            })
            .catch(this.handleError);
    }

    post(url: string, data: any): Observable<any> {
        return this.http.post(url, JSON.stringify(data), { headers: this.headers })
            .catch(this.handleError);
    }

    put(url: string, data: any): Observable<any> {
        return this.http.put(url, JSON.stringify(data), { headers: this.headers })
            .catch(this.handleError);
    }

    delete(url: string, data?: any): Observable<any> {
        return this.http.delete(url, { headers: this.headers })
            .catch(this.handleError);
    }

    private handleError(e: any) {
        console.error(e);
        // if (e && e.error && e.error.errorCode) {
        //     return Observable.throw(e.error.errorCode);
        // }
        return Observable.throw(e);
    }
}