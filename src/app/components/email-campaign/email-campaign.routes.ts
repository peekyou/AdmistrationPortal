import { Routes } from '@angular/router';

import { EmailCampaignComponent } from './email-campaign.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'email', data: { permission: Permissions.Email }, canActivate: [AuthGuard, PermissionGuard], children: [
            { path: '', component: EmailCampaignComponent }
        ]
    },
];