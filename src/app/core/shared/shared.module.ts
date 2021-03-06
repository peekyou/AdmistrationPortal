import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../../pipes';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { NgAutoCompleteModule } from "ng-auto-complete";
import { LoadingModule } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule } from '@agm/core';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
// import { InternationalPhoneModule } from 'ng4-intl-phone';
// import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';

import { LockComponent } from './components/lock/lock.component';
import { AlertComponent } from './components/alert/alert.component';
import { ServerErrorMessageComponent } from './components/server-error-message/server-error-message.component';
import { NotificationsComponent } from './components/notifcations/notifications.component';
import { AddressComponent } from './components/address/address.component';
import { AutoCompleteComponent } from './components/autocomplete/autocomplete.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';
import { TimeRangeComponent } from './components/time-range/time-range.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { GroupBarChartComponent } from './components/group-bar-chart/group-bar-chart.component';
import { CountryMapComponent } from './components/country-map/country-map.component';
import { CustomerTableComponent } from './components/customer-table/customer-table.component';
import { CircleProgressComponent } from './components/circle-progress/circle-progress.component';
import { EtiquetteCardComponent } from './components/etiquette-card/etiquette-card.component';
import { PhoneNumberComponent } from './components/intl-phone-number/intl-phone-number.component';
import { DynamicFieldComponent } from './components/dynamic-field/dynamic-field.component';
import { DynamicFieldSearchComponent } from './components/dynamic-field-search/dynamic-field-search.component';

import { AppModal } from './modals/modal';
import { DeleteModal } from './modals/delete.modal';
import { EmailCampaignModal } from './modals/email-campaign/email-campaign.modal';
import { SmsPreviewModal } from './modals/sms-preview/sms-preview.modal';

import { OnlyNumberDirective } from '../../directives/only-number.directive';

const MODALS = [
    AppModal,
    DeleteModal,
    EmailCampaignModal,
    SmsPreviewModal
];

const IMPORTS = [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    InfiniteScrollModule,
    TranslateModule,
    NgAutoCompleteModule,
    LoadingModule,
    PipesModule,
    NgxPaginationModule,
    AgmCoreModule,
    MultiselectDropdownModule,
    ZXingScannerModule
    // InternationalPhoneModule,
    // InternationalPhoneNumberModule
];

const DECLARATIONS = [
    LockComponent,
    AlertComponent,
    ServerErrorMessageComponent,
    NotificationsComponent,
    AddressComponent,
    AutoCompleteComponent,
    FileUploadComponent,
    SubmitButtonComponent,
    TimeRangeComponent,
    PieChartComponent,
    DonutChartComponent,
    LineChartComponent,
    GroupBarChartComponent,
    CountryMapComponent,
    CustomerTableComponent,
    CircleProgressComponent,
    EtiquetteCardComponent,
    PhoneNumberComponent,
    DynamicFieldComponent,
    DynamicFieldSearchComponent,
    OnlyNumberDirective
];

@NgModule({
    imports: [IMPORTS],
    exports: [IMPORTS, ...DECLARATIONS, ...MODALS],
    declarations: [DECLARATIONS, ...MODALS],
    entryComponents: MODALS
})
export class SharedModule { }