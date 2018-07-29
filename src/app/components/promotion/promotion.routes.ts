import { Routes } from '@angular/router';

import { PromotionComponent } from './promotion.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'promotions', data: { permission: Permissions.Promotions }, canActivate: [ AuthGuard, PermissionGuard ], children: [
            { path: '', component: PromotionComponent }
        ]
    },
];