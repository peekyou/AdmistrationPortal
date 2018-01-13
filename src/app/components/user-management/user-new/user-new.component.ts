import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { User, Permission } from '../user';
import { UserManagementService } from '../user-management.service';

@Component({
    templateUrl: './user-new.component.html'
})
export class UserNewComponent {
    permissions: Permission[];

    constructor(protected service: UserManagementService, protected route: ActivatedRoute,
        protected router: Router, protected location: Location) {
    }

    create(form: FormGroup) {
        let newUser: User = {
            id: null,
            username: form.value.username,
            password: form.value.password,
            firstname: form.value.firstname,
            lastname: form.value.lastname,
            status: form.value.status,
            permissions: form.value.userPermissions
        };

        this.service
            .createUser(newUser)
            .subscribe(
                id => this.router.navigate(['/usermanagement']),
                err => { console.log(err); }
            );
    }
}