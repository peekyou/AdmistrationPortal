import { Routes } from '@angular/router';

import { StatsComponent } from './stats.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'dashboard', data: { permission: Permissions.Statistics }, canActivate: [AuthGuard, PermissionGuard], children: [
            { path: '', component: StatsComponent }
        ]
    },
];