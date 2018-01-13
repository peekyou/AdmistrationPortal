import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { HttpService } from '../../core/services/http.service';
import { AppSettings } from '../../app.settings';
import { parseJwt } from '../../core/helpers/utils';

@Injectable()
export class UserService {
    private api = AppSettings.API_ENDPOINT + '/users';
    private permissions: string[];
    public token: string = null;
    
    constructor(private http: HttpService) {
        this.token = localStorage.getItem('token');
        this.permissions = [];
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http
            .post(AppSettings.API_ENDPOINT + '/login', { username: username, password: password, userType: 'merchant' })
            .map((response: any) => {
                // login successful if there's a jwt token in the response
                let token = response.token; 
                if (token) {
                    this.token = token;
                    localStorage.setItem('token', token);
                    var claims = parseJwt(this.token);
                    this.permissions = claims['http://wardsapp.com/claims/permissions'];
                    return true;
                } else {
                    return false;
                }
            });
    }

    logout(): void {
        this.token = null;
        this.permissions = [];
        localStorage.removeItem('token');
    }

    isAuthenticated(): boolean {
        return this.token != null;
    }

    hasPermission(permission: string): boolean {
        if (!permission) {
            return false;
        }
        return this.permissions.indexOf(permission) > -1;
    }
}