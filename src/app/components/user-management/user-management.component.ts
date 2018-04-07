import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslationService } from '../../core/services/translation.service';
import { UserModal } from './user-modal/user.modal';
import { UserManagementService } from './user-management.service';
import { User, Permission } from '../user/user';
import { PagingResponse } from '../../core/models/paging';

@Component({
    styleUrls: [ './user-management.component.scss' ],
    templateUrl: './user-management.component.html'
})
export class UserManagementComponent {
    modalNewUserTitle: string;
    modalEditUserTitle: string;
    users: PagingResponse<User>;
    permissions: Permission[];
    loading = false;
    currentPage: number = 1;
    productForm: FormGroup;
    @Input() itemsPerPage: number = 30;

    constructor(
        private fb: FormBuilder,
        private service: UserManagementService, 
        private modalService: NgbModal, 
        translation: TranslationService) {

        this.getUsersPage();
        this.service.getPermissions()
            .subscribe(
                res => this.permissions = res,
                err => console.log(err)
            );

        translation.getMultiple([
            'USER_MANAGEMENT.NEW',
            'USER_MANAGEMENT.EDIT'], x => {
                this.modalNewUserTitle = x['USER_MANAGEMENT.NEW'];
                this.modalEditUserTitle = x['USER_MANAGEMENT.EDIT'];
        });

        this.initProductForm();
     }

     getUsersPage() {
        this.loading = true;
        this.service.getUsers(this.currentPage, this.itemsPerPage)
            .subscribe(
                users => {
                    this.users = users;
                    this.loading = false;
                },
                err => { console.log(err); }
            );
    }

    pageChanged(page) {
        this.currentPage = page;
        this.getUsersPage();
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

    openUserModal(user: User = null) {
        const modalRef = this.modalService.open(UserModal, { 
            windowClass: 'user-modal',
        });
        modalRef.componentInstance.isEdit = user != null;
        modalRef.componentInstance.user = user;
        modalRef.componentInstance.title = user != null ? this.modalEditUserTitle : this.modalNewUserTitle;

        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.getUsersPage();
            }
        }, (reason) => { });
    }

    initProductForm() {
        this.productForm = this.fb.group({
            name: [null, Validators.required]
        });
    }
}
