import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppModal } from './modal';
import { DeleteModal } from './delete.modal';
import { EmailCampaignModal } from './email-campaign/email-campaign.modal';

const MODALS = [
    AppModal,
    DeleteModal,
    EmailCampaignModal
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule
    ],
    exports: MODALS,
    declarations: MODALS,
    entryComponents: MODALS
})
export class ModalsModule { }