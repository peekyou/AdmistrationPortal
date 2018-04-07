import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmailCampaignComponent } from './email-campaign.component';
import { routes } from './email-campaign.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        EmailCampaignComponent
    ]
})
export class EmailCampaignModule { }