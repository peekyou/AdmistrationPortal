import { Routes } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'customers', data: { permission: Permissions.Customers }, canActivate: [AuthGuard, PermissionGuard], children: [
            { path: '', component: CustomerComponent },
            { path: ':id', component: CustomerDetailComponent }
        ]
    },
];