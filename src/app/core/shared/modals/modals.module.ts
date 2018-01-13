import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DeleteModal } from './delete.modal';

const MODALS = [
    DeleteModal
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