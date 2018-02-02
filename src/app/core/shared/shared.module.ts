import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../../pipes';
import { ModalsModule } from './modals/modals.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { NgAutoCompleteModule } from "ng-auto-complete";

import { CountryPickerComponent } from './components/country-picker/country-picker.component';
import { LanguagePickerComponent } from './components/language-picker/language-picker.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';
import { TimeRangeComponent } from './components/time-range/time-range.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';

const IMPORTS = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    InfiniteScrollModule,
    TranslateModule,
    NgAutoCompleteModule,
    PipesModule,
    ModalsModule
];

const DECLARATIONS = [
    CountryPickerComponent,
    LanguagePickerComponent,
    FileUploadComponent,
    SubmitButtonComponent,
    TimeRangeComponent,
    LineChartComponent
];

@NgModule({
    imports: [IMPORTS],
    exports: [IMPORTS, ...DECLARATIONS],
    declarations: [DECLARATIONS]
})
export class SharedModule { }