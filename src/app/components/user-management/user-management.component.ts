import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserManagementService } from './user-management.service';
import { User } from './user';
import { PagingResponse } from '../../core/models/paging';

@Component({
    styleUrls: [ './user-management.component.scss' ],
    templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
    users: PagingResponse<User>;

    constructor(private service: UserManagementService) { }

    ngOnInit() {
        this.service
            .getUsers()
            .subscribe(
                users => this.users = users,
                err => { console.log(err); }
            );
    }
    
    delete(user: User) {
        this.service
            .deleteUser(user)
            .subscribe(
                r => {
                    var index = this.users.data.indexOf(user);
                    if (index > -1) {
                        this.users.data.splice(index, 1);
                        this.users.paging.totalCount--;
                    }
                },
                err => { console.log(err); }
            );
    }
}
