import { Injectable, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import { LoyaltyProgram } from '../../core/models/loyaltyPrograms';
import { AppwardsPackage } from '../../core/models/appwardsPackage';
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
    private package: number;
    private showCustomerAddressLine: boolean;
    private customerCardsOrder: string;
    private systemCustomerId: string;
    private accessibleMerchants: MerchantInfo[];
    public customerCustomFields: CustomerCustomFields[];
    public loyaltyPrograms: LoyaltyProgram[];
    public token: string = null;
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpService) {
        if (config.GroupId) {
            this.tokenKey = this.tokenKey + '-' + config.GroupId; 
            this.customFieldsKey = this.customFieldsKey + '-' + config.GroupId;
        }
        this.api = config.ApiEndpoint;        
        this.token = localStorage.getItem(this.tokenKey);
        // var customFields = localStorage.getItem(this.customFieldsKey);
        // if (customFields) {
        //     this.customerCustomFields = JSON.parse(customFields);
        // }
        this.setPermissions();
        this.setCustomerCustomFields();
        this.setLoyaltyPrograms();
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
                    this.setLoyaltyPrograms();
                    
                    if (!this.permissions || this.permissions.length == 0) {
                        this.logout();
                    }
                    return true;
                } else {
                    return false;
                }
            });
    }

    setPassword(password: string, token: string, code: string): Observable<boolean> {
        return this.http.put(this.api + '/users/password', { token: token, password: password, code: code });
    }

    forgetPassword(email: string): Observable<boolean> {
        return this.http.post(this.api + '/users/password/forget', { email: email, groupId: this.config.GroupId });
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
        this.package = null;
        this.showCustomerAddressLine = null;
        this.customerCardsOrder = null;
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

    getPackage(): number {
        if (this.token && !this.package) {
            var claims = parseJwt(this.token);
            this.package = claims[Claims.Profile + '/Package'];
        }
        return this.package;
    }

    getShowCustomerAddressLine(): boolean {
        if (this.token && !this.showCustomerAddressLine) {
            var claims = parseJwt(this.token);
            var showAddress = claims[Claims.Profile + '/ShowCustomerAddressLine'];
            this.showCustomerAddressLine = showAddress ? showAddress.toLowerCase() == 'true' : false;
        }
        return this.showCustomerAddressLine;
    }

    getCustomerCardsOrder(): number[] {
        if (this.token && !this.customerCardsOrder) {
            var claims = parseJwt(this.token);
            this.customerCardsOrder = claims[Claims.Profile + '/CustomerCardsOrder'];
        }
        if (this.customerCardsOrder) {
            return this.customerCardsOrder.split(';').map(Number);
        }
        return [1,2,3,4];
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

    getPackagesPrice(): Observable<AppwardsPackage[]> {
        return this.http.get(this.api + '/packages/' + this.getCountryCode());
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

    showCustomControl(index: number, form: FormGroup = null, isSearch = false) {
        if (this.customerCustomFields && this.customerCustomFields.length > index - 1) {
            var field = this.customerCustomFields[index - 1];
            if (!form) {
                return field != null;
            }
            var control = form.get('customField' + index);
            if (!control && field) {
                form.addControl('customField' + index, new FormControl(field.multiselect && !isSearch ? [] : field.fieldType == 'checkbox' && !isSearch ? false : null, field.mandatory && !isSearch ? Validators.required : null));
                return true;
            }
            else if (control) {
                return true;
            }
        }
        return false;
    }

    private setCustomerCustomFields() {
        if (this.token) {
            this.http
                .get(this.api + '/merchants/customfields', this.token)
                .subscribe(response => {
                    if (response) {
                        this.customerCustomFields = response;
                        localStorage.setItem(this.customFieldsKey, JSON.stringify(this.customerCustomFields));
                    }
                });
        }
    }

    private setLoyaltyPrograms() {
        if (this.token) {
            this.http
                .get(this.api + '/merchants/loyalty', this.token)
                .subscribe(response => {
                    if (response) {
                        this.loyaltyPrograms = response;
                    }
                });
        }
    }
}