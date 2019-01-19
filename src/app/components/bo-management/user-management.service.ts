import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { User, Permission } from '../user/user';
import { Permissions } from '../../core/helpers/permissions';
import { PagingResponse } from '../../core/models/paging';
import { TranslationService } from '../../core/services/translation.service';

@Injectable()
export class UserManagementService {
    private api: string;
    permissions: Permission[];    
    
    constructor(
        @Inject(APP_CONFIG) private config: AppConfig,
        private http: AuthHttpService,
        private translation: TranslationService) {
            this.api = config.ApiEndpoint + '/users';
    }

    getUser(id: string): Observable<User> {
        return this.http.get(this.api + '/' + id);
    }

    getPermissions(): Observable<Permission[]> {
        return this.http.get(this.config.ApiEndpoint + '/permissions')
                        .map((res: Permission[]) => {
                            this.permissions = res.filter(x => x.id != Permissions.SMS && x.id != Permissions.Email);
                            this.setPermissionsTranslation();
                            return this.permissions;
                        });
    }

    setPermissionsTranslation() {
        if (this.permissions) {
            var keys = this.permissions.map(p => 'PERMISSIONS.' + p.resourceKey);
            this.translation.getMultiple(keys, x => {
                this.permissions.forEach(p => {
                    p.resourceKey = x['PERMISSIONS.' + p.resourceKey]
                });
            });
        }
    }

    getUsers(page: number, count: number): Observable<PagingResponse<User>> {
        return this.http.get(this.api + '?pageNumber=' + page + '&itemsCount=' + count);
    }

    createUser(user: User): Observable<any> {
        return this.http.post(this.api, user);
    }

    editUser(user: User): Observable<void> {
        return this.http.put(this.api + '/' + user.id, user);
    }

    deleteUser(user: User): Observable<void> {
        return this.http.delete(this.api + '/' + user.id);
    }
}