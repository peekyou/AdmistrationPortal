import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { User, Permission } from '../../user/user';
import { UserManagementService } from '../user-management.service';

@Component({
    templateUrl: './user-edit.component.html'
})
export class UserEditComponent {
    private user: User;

    constructor(protected service: UserManagementService, protected fb: FormBuilder, protected route: ActivatedRoute,
        protected router: Router, protected location: Location) {
    }

    getUser(form: FormGroup) {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.service.getUser(params.get('id')))
            .subscribe(user => {
                this.user = user;
                form.patchValue({
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    status: user.status
                })
                this.setPermissionsControls(<FormArray>form.controls.permissions,
                    <FormArray>form.controls.userPermissions);
            });
    }

    setPermissionsControls(permisionsControl: FormArray, userPermissionsControl: FormArray) {
        if (permisionsControl && userPermissionsControl) {
            this.user.permissions.forEach(permission => {
                var c = permisionsControl.controls.find((x: FormGroup) => {
                    return x.get(permission) != null;
                });
                if (c) {
                    c.get(permission).patchValue(true);
                }
                userPermissionsControl.push(new FormControl(permission));
            });
        }
    }

    edit(form: FormGroup) {
        this.user

        let newUser: User = {
            id: this.user.id,
            username: form.value.username,
            password: form.value.password,
            firstname: form.value.firstname,
            lastname: form.value.lastname,
            status: form.value.status,
            permissions: form.value.userPermissions
        };

        this.service
            .editUser(newUser)
            .subscribe(
                id => this.router.navigate(['/usermanagement']),
                err => { console.log(err); }
            );
    }
}