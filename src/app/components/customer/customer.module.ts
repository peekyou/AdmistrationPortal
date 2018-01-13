import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { CustomerDetailComponent } from './customer-detail';
import { CustomerSearchComponent } from './customer-search';
import { CustomerNewComponent } from './customer-new';
import { routes } from './customer.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CustomerComponent,
        CustomerDetailComponent,
        CustomerSearchComponent,
        CustomerNewComponent
    ]
})
export class CustomerModule { }