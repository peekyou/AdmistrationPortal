import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CampaignComponent } from './campaign.component';
import { EmailCampaignComponent } from './email/email-campaign.component';
import { SmsCampaignComponent } from './sms/sms-campaign.component';
import { PushCampaignComponent } from './push/push-campaign.component';
import { PromotionComponent } from './promotion/promotion.component';
import { PromotionListComponent } from './promotion/promotion-list/promotion-list.component';
import { PromotionInfoComponent } from './promotion/promotion-info/promotion-info.component';
import { PromotionFilterComponent } from './promotion/promotion-filter/promotion-filter.component';
import { PackPurchaseModal } from './pack/pack-purchase.modal';

import { routes } from './campaign.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CampaignComponent,
        EmailCampaignComponent,
        SmsCampaignComponent,
        PushCampaignComponent,
        PromotionComponent,
        PromotionListComponent,
        PromotionInfoComponent,
        PromotionFilterComponent,
        PackPurchaseModal
    ],
    entryComponents: [PackPurchaseModal]
})
export class CampaignModule { }