import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from 'ng2-ckeditor';
import { DndModule } from 'ng2-dnd';
import { ColorPickerModule } from 'ngx-color-picker';
import { MobilePreviewModule } from '../mobile-preview/mobile-preview.module';

import { ContentEditorComponent } from './content-editor.component';
import { PageCreateComponent } from './+page-create/page-create.component';
import { PageHeaderComponent } from './+page-header/page-header.component';
import { ContentEditorService } from './content-editor.service';
import { routes } from './content-editor.routes';

@NgModule({
    imports: [
        SharedModule,
        CKEditorModule,
        DndModule.forRoot(),
        ColorPickerModule,
        MobilePreviewModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ContentEditorComponent,
        PageCreateComponent,
        PageHeaderComponent
    ]
})
export class ContentEditorModule { }