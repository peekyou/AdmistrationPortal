import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserManagementComponent } from './user-management.component';
import { UserNewComponent } from './user-new/user-new.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserForm } from './+user-form/user.form';
import { routes } from './user-management.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        UserManagementComponent,
        UserNewComponent,
        UserEditComponent,
        UserForm
    ]
})
export class UserManagementModule { }