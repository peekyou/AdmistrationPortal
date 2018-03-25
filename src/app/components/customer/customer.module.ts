import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { CustomerForm } from './+customer-form/customer.form';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CustomerNewModal } from './customer-new/customer-new.modal';
import { routes } from './customer.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CustomerComponent,
        CustomerForm,
        CustomerDetailComponent,
        CustomerSearchComponent,
        CustomerNewModal
    ],
    entryComponents: [
        CustomerNewModal
    ]
})
export class CustomerModule { }