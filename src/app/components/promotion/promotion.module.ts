import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PromotionComponent } from './promotion.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { PromotionInfoComponent } from './promotion-new/promotion-info/promotion-info.component';
import { PromotionFilterComponent } from './promotion-new/promotion-filter/promotion-filter.component';
import { routes } from './promotion.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        PromotionComponent,
        PromotionListComponent,
        PromotionInfoComponent,
        PromotionFilterComponent
    ]
})
export class PromotionModule { }