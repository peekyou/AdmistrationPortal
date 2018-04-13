import { Routes } from '@angular/router';

import { BackOfficeManagementComponent } from './bo-management.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'management', data: { permission: Permissions.Management }, canActivate: [AuthGuard, PermissionGuard], children: [
            { path: '', component: BackOfficeManagementComponent }
        ]
    },
];