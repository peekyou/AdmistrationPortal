import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SponsorComponent } from './sponsor.component';
import { routes } from './sponsor.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        SponsorComponent
    ]
})
export class SponsorModule { }