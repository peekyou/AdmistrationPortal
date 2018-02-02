import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TreeviewModule } from 'ngx-treeview';

import { HeaderComponent } from './header.component';
import { UserPopoverComponent } from './popover/user-popover.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        TreeviewModule
    ],
    declarations: [
        HeaderComponent,
        UserPopoverComponent
    ],
    exports: [
        HeaderComponent
    ]
})
export class HeaderModule { }