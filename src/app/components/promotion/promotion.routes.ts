import { Routes } from '@angular/router';

import { PromotionComponent } from './promotion.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { PromotionNewComponent } from './promotion-new/promotion-new.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'promotions', data: { permission: Permissions.Promotions }, canActivate: [ AuthGuard, PermissionGuard ], children: [
            { path: '', component: PromotionComponent },
            { path: 'new', component: PromotionNewComponent },
            { path: 'list', component: PromotionListComponent }
        ]
    },
];