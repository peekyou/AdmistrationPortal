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
import { LoadingModule } from 'ngx-loading';

import { AlertComponent } from './components/alert/alert.component';
import { AddressComponent } from './components/address/address.component';
import { AutoCompleteComponent } from './components/autocomplete/autocomplete.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';
import { TimeRangeComponent } from './components/time-range/time-range.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { GroupBarChartComponent } from './components/group-bar-chart/group-bar-chart.component';
import { CountryMapComponent } from './components/country-map/country-map.component';

const IMPORTS = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    InfiniteScrollModule,
    TranslateModule,
    NgAutoCompleteModule,
    LoadingModule,
    PipesModule,
    ModalsModule
];

const DECLARATIONS = [
    AlertComponent,
    AddressComponent,
    AutoCompleteComponent,
    FileUploadComponent,
    SubmitButtonComponent,
    TimeRangeComponent,
    LineChartComponent,
    GroupBarChartComponent,
    CountryMapComponent
];

@NgModule({
    imports: [IMPORTS],
    exports: [IMPORTS, ...DECLARATIONS],
    declarations: [DECLARATIONS]
})
export class SharedModule { }