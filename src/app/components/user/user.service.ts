﻿import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { HttpService } from '../../core/services/http.service';
import { parseJwt } from '../../core/helpers/utils';
import { Claims } from '../../core/helpers/permissions';
import { MerchantInfo } from '../../core/models/merchantInfo';
import { CustomerCustomFields } from '../../core/models/customerCustomFields';
import { UserPreferences } from './user';

@Injectable()
export class UserService {
    private tokenKey = 'token';
    private customFieldsKey = 'customfields';
    private api: string;
    private permissions: string[];
    private username: string;
    private userId: string;
    private countryCode: string;
    private systemCustomerId: string;
    private accessibleMerchants: MerchantInfo[];
    public customerCustomFields: CustomerCustomFields;
    public token: string = null;
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpService) {
        if (config.GroupId) {
            this.tokenKey = this.tokenKey + '-' + config.GroupId; 
        }
        this.api = config.ApiEndpoint;        
        this.token = localStorage.getItem(this.tokenKey);
        this.customerCustomFields = JSON.parse(localStorage.getItem(this.customFieldsKey));
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
                    localStorage.setItem(this.tokenKey, token);
                    this.setPermissions();
                    this.setCustomerCustomFields();
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
        this.countryCode = null;
        this.systemCustomerId = null;
        this.accessibleMerchants = null;
        this.permissions = null;
        this.customerCustomFields = null;
        localStorage.removeItem(this.tokenKey);
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

    getSystemCustomerId(): string {
        if (this.token && !this.systemCustomerId) {
            var claims = parseJwt(this.token);
            this.systemCustomerId = claims[Claims.Profile + '/SystemCustomerId'];
        }
        return this.systemCustomerId;
    }

    getCountryCode(): string {
        if (this.token && !this.countryCode) {
            var claims = parseJwt(this.token);
            this.countryCode = claims[Claims.Profile + '/CountryCode'];
        }
        return this.countryCode;
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

    getCurrency(merchantId: string = null) {
        this.getAccessibleMerchants();
        if (this.accessibleMerchants && this.accessibleMerchants.length > 0) {
            if (!merchantId) {
                return this.accessibleMerchants[0].currency;
            }
            for (var i = 0; i < this.accessibleMerchants.length; i++) {
                if (this.accessibleMerchants[i].merchantId == merchantId) {
                    return this.accessibleMerchants[i].currency;
                }
            }
        }
        return null;
    }

    getAccessibleMerchants() {
        if (this.token && !this.accessibleMerchants) {
            var claims = parseJwt(this.token);
            this.accessibleMerchants = JSON.parse(claims[Claims.Profile + '/AccessibleMerchants']);
        }
        return this.accessibleMerchants;
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

    private setCustomerCustomFields() {
        this.http
            .get(this.api + '/merchants/customfields', this.token)
            .subscribe(response => {
                this.customerCustomFields = response;
                localStorage.setItem(this.customFieldsKey, JSON.stringify(this.customerCustomFields));
            });
    }
}