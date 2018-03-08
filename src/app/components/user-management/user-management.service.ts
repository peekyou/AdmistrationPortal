import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { User, Permission } from '../user/user';
import { PagingResponse } from '../../core/models/paging';


@Injectable()
export class UserManagementService {
    private api: string;
    
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint + '/users';
    }

    getUser(id: string): Observable<User> {
        return this.http.get(this.api + '/' + id);
    }

    getPermissions(): Observable<Permission[]> {
        return this.http.get(this.config.ApiEndpoint + '/permissions');

        //return Observable.of([
        //    { id: '1', name: 'Customers' },
        //    { id: '2', name: 'Content' },
        //    { id: '3', name: 'Review' },
        //    { id: '4', name: 'Promotions' },
        //    { id: '5', name: 'Sms recharge' },
        //    { id: '6', name: 'User management' },
        //    { id: '7', name: 'Bills' }
        //]);
    }

    getUsers(): Observable<PagingResponse<User>> {
        return this.http.get(this.api);
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