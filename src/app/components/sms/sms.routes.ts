import { Routes } from '@angular/router';

import { SmsComponent } from './sms.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'sms', data: { permission: Permissions.SMS }, canActivate: [AuthGuard, PermissionGuard], children: [
            { path: '', component: SmsComponent }
        ]
    },
];