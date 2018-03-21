import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { APP_CONFIG, AppConfig } from '../../app.config';
import { HttpService } from '../../core/services/http.service';
import { parseJwt } from '../../core/helpers/utils';
import { Claims } from '../../core/helpers/permissions';
import { UserPreferences } from './user';

@Injectable()
export class UserService {
    private api: string;
    private permissions: string[];
    private username: string;
    private userId: string;
    public token: string = null;
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpService) {
        this.api = config.ApiEndpoint;        
        this.token = localStorage.getItem('token');
        this.setPermissions();
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http
            .post(this.api + '/login', { username: username, password: password, userType: 'merchant', groupId: this.config.GroupId })
            .map((response: any) => {
                // login successful if there's a jwt token in the response
                let token = response.token; 
                if (token) {
                    this.token = token;
                    localStorage.setItem('token', token);
                    this.setPermissions();
                    return true;
                } else {
                    return false;
                }
            });
    }

    setPermissions() {
        if (this.token) {
            var claims = parseJwt(this.token);
            this.permissions = claims[Claims.Permissions];
        }
        else {
            this.permissions = [];
        }
    }

    logout(): void {
        this.token = null;
        this.userId = null;
        this.username = null;
        this.permissions = [];
        localStorage.removeItem('token');
    }

    isAuthenticated(): boolean {
        return this.token != null;
    }

    getUsername(): string {
        if (this.token && !this.username) {
            var claims = parseJwt(this.token);
            this.username = claims[Claims.Name];
        }
        return this.username;
    }

    getUserId(): string {
        if (this.token && !this.userId) {
            var claims = parseJwt(this.token);
            this.userId = claims[Claims.Profile + '/UserId'];
        }
        return this.userId;
    }

    hasPermission(permission: string): boolean {
        if (!permission || !this.permissions) {
            return false;
        }
        return this.permissions.indexOf(permission) > -1;
    }

    getPreferences(userId: string): Observable<UserPreferences> {
        if (userId) {
            return this.http.get(this.api + '/users/' + userId + '/preferences');
        }
    }

    savePreferences(preferences: UserPreferences): Observable<boolean> {
        if (preferences) {
            return this.http.post(this.api + '/users/preferences', 
            { 
                userId: this.getUserId(), 
                merchantsIds: preferences.merchantsIds, 
                lang: null
            });
        }
    }
}