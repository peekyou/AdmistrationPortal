import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StatsComponent } from './stats.component';
import { routes } from './stats.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        StatsComponent
    ]
})
export class StatsModule { }