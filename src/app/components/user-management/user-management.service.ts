import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { User, Permission } from '../user/user';
import { PagingResponse } from '../../core/models/paging';


@Injectable()
export class UserManagementService {
    private api: string;
    permissions: Permission[];    
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint + '/users';
    }

    getUser(id: string): Observable<User> {
        return this.http.get(this.api + '/' + id);
    }

    getPermissions(): Observable<Permission[]> {
        if (this.permissions) {
            return Observable.of(this.permissions);
        }
        return this.http.get(this.config.ApiEndpoint + '/permissions')
                        .map(res => this.permissions = res);
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