import { Routes } from '@angular/router';

import { ReviewComponent } from './review.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'reviews', data: { permission: Permissions.Reviews }, canActivate: [AuthGuard, PermissionGuard], children: [
            { path: '', component: ReviewComponent }
        ]
    },
];