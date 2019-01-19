import { Routes } from '@angular/router';

import { CampaignComponent } from './campaign.component';
import { EmailCampaignComponent } from './email/email-campaign.component';
import { SmsCampaignComponent } from './sms/sms-campaign.component';
import { PushCampaignComponent } from './push/push-campaign.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'campaigns', canActivate: [AuthGuard], children: [
            { path: '', component: CampaignComponent },
            { path: 'email', component: EmailCampaignComponent, data: { permission: Permissions.Marketing }, canActivate: [PermissionGuard] },
            { path: 'sms', component: SmsCampaignComponent, data: { permission: Permissions.Marketing }, canActivate: [PermissionGuard] },
            { path: 'push', component: PushCampaignComponent, data: { permission: Permissions.Marketing }, canActivate: [PermissionGuard] }            
        ]
    },
];