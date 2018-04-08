import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BackOfficeManagementComponent } from './bo-management.component';
import { UserModal } from './user-modal/user.modal';
import { UserForm } from './+user-form/user.form';
import { routes } from './bo-management.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        BackOfficeManagementComponent,
        UserForm,
        UserModal
    ],
    entryComponents: [
        UserModal
    ]
})
export class BackOfficeManagementModule { }