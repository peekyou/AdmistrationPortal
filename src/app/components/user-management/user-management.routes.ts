import { Routes } from '@angular/router';

import { UserManagementComponent } from './user-management.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'usermanagement', data: { permission: Permissions.UserManagement }, canActivate: [AuthGuard, PermissionGuard], children: [
            { path: '', component: UserManagementComponent }
        ]
    },
];