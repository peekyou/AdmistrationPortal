import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../../pipes';
import { ModalsModule } from './modals/modals.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';

import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';
import { TimeRangeComponent } from './components/time-range/time-range.component';

const IMPORTS = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    InfiniteScrollModule,
    TranslateModule,
    PipesModule,
    ModalsModule
];

const DECLARATIONS = [
    FileUploadComponent,
    SubmitButtonComponent,
    TimeRangeComponent
];

@NgModule({
    imports: [IMPORTS],
    exports: [IMPORTS, ...DECLARATIONS],
    declarations: [DECLARATIONS]
})
export class SharedModule { }
