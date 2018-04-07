import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { User, Permission } from '../../user/user';
import { UserManagementService } from '../user-management.service'

@Component({
    styleUrls: ['./user.modal.scss'],
    templateUrl: './user.modal.html'
})
export class UserModal {
    error: boolean;
    saveSubscription: Subscription;
    @Input() title: string;
    @Input() isEdit: boolean;
    @Input() user: User;

    constructor(
        public activeModal: NgbActiveModal,
        private router: Router,
        private service: UserManagementService) { }

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
                id => { 
                    this.activeModal.close('Y');
                },
                err => { 
                    this.error = true;
                    console.log(err); 
                }
            );
    }

    setUser(form: FormGroup) {
        if (this.user) {
            form.patchValue({
                username: this.user.username,
                firstname: this.user.firstname,
                lastname: this.user.lastname,
                status: this.user.status
            })
            this.setPermissionsControls(<FormArray>form.controls.permissions,
                <FormArray>form.controls.userPermissions);
        }
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
                id => this.activeModal.close('Y'),
                err => { console.log(err); }
            );
    }
 }