﻿import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserManagementComponent } from './user-management.component';
import { UserModal } from './user-modal/user.modal';
import { UserForm } from './+user-form/user.form';
import { routes } from './user-management.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        UserManagementComponent,
        UserForm,
        UserModal
    ],
    entryComponents: [
        UserModal
    ]
})
export class UserManagementModule { }