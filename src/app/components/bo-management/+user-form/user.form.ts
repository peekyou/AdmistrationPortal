import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User, Permission } from '../../user/user';
import { UserManagementService } from '../user-management.service';
import { DeleteModal } from '../../../core/shared/modals/delete.modal';

@Component({
    selector: 'app-user-form',
    styleUrls: ['./user.form.scss'],
    templateUrl: './user.form.html'
})
export class UserForm implements OnInit {
    form: FormGroup;
    permissions: Permission[];
    isEdit: boolean;
    @Input() submitSubscription;
    @Output() onPopulate: EventEmitter<any> = new EventEmitter();
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();
    @Output() onDelete: EventEmitter<any> = new EventEmitter();

    constructor(
        private fb: FormBuilder, 
        private service: UserManagementService, 
        private location: Location,
        private modalService: NgbModal) {}

    ngOnInit() {        
        this.init();
        this.isEdit = this.onPopulate.observers.length > 0;
    }
    
    init() {
        this.form = this.fb.group({
            username: [null, Validators.required],
            password: [null],
            passwordConfirmation: [null],
            firstname: [null, Validators.required],
            lastname: [null, Validators.required],
            email: [null, Validators.email],
            status,
            permissions: this.fb.array([]),
            userPermissions: this.fb.array([])
        }, { validator: this.areEqual('password', 'passwordConfirmation') });

        this.getPermissions(<FormArray>this.form.controls.permissions);
    }

    areEqual(field1: string, field2: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let f1 = group.controls[field1];
            let f2 = group.controls[field2];
            if (f1.value && f2.value && f1.value !== f2.value) {
                return {
                    passwords: "Passwords should match"
                };
            }
            return {};
        }
    }
    
    getPermissions(formArray: FormArray) {
        this.service
            .getPermissions()
            .subscribe(p => {
                this.permissions = p;
                this.permissions.forEach(permission => {
                    let fg = new FormGroup({});
                    fg.addControl(permission.id, new FormControl(false))
                    formArray.push(fg);
                });
                this.onPopulate.emit(this.form);
            });
    }
    
    onChange(permission: Permission, isChecked: boolean) {
        const userPermissions = <FormArray>this.form.controls.userPermissions;

        if (isChecked) {
            userPermissions.push(new FormControl(permission.id));
        } else {
            let index = userPermissions.controls.findIndex(x => x.value == permission.id)
            userPermissions.removeAt(index);
        }
    }

    //private setUserPermissions() {
    //    const permissions = <FormArray>this.form.controls.permissions;
    //    permissions.controls.forEach((p, i) => {
    //        var group = <FormGroup>p;
    //        Object.keys(group.controls).forEach(key => {
    //            var control = group.get(key);
    //            if (control.value === true) {
    //                (<FormArray>this.form.controls.userPermissions).push(new FormControl(key));
    //            }
    //        });
    //    });
    //}

    submit() {
        //this.setUserPermissions();
        this.onSubmit.emit(this.form);
    }

    openDeleteModal() {
        const modalRef = this.modalService.open(DeleteModal);
        modalRef.componentInstance.data = this.username.value;

        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.delete();
            }
        }, (reason) => { });
    }

    delete() {
        this.onDelete.emit();
    }
    
    get username() { return this.form.get('username'); }
    get password() { return this.form.get('password'); }
    get passwordConfirmation() { return this.form.get('passwordConfirmation'); }
    get email() { return this.form.get('email'); }
    get firstname() { return this.form.get('firstname'); }
    get lastname() { return this.form.get('lastname'); }
}