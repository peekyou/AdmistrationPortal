import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MobilePreviewComponent } from './mobile-preview.component';
import { routes } from './mobile-preview.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        MobilePreviewComponent
    ],
    declarations: [
        MobilePreviewComponent
    ]
})
export class MobilePreviewModule { }