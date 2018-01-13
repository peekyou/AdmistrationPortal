import { Routes } from '@angular/router';

import { BillingComponent } from './billing.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'billing', data: { permission: Permissions.Bills }, canActivate: [AuthGuard, PermissionGuard], children: [
            { path: '', component: BillingComponent }
        ]
    },
];