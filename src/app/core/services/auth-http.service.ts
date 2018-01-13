import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RequestArgs } from "@angular/http/src/interfaces";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { UserService } from '../../components/user/user.service';
import { HttpService } from './http.service';

@Injectable()
export class AuthHttpService extends HttpService {

    constructor(http: HttpClient, private authenticationService: UserService) {
        super(http);
    }

    get(url: string): Observable<any> {
        this.addAuthHeader();
        return super.get(url);
    }

    post(url: string, data: any): Observable<any> {
        this.addAuthHeader();
        return super.post(url, data);
    }

    put(url: string, data: any): Observable<any> {
        this.addAuthHeader();
        return super.put(url, data);
    }

    delete(url: string, data?: any): Observable<any> {
        this.addAuthHeader();
        return super.delete(url, data);
    }

    private addAuthHeader() {
        if (this.authenticationService.isAuthenticated()) {
            this.headers['Authorization'] = 'Bearer ' + this.authenticationService.token;
        }
    }
}