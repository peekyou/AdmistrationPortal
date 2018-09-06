import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { DynamicCardComponent } from './customer-detail/dynamic-card.component';
import { CustomerFormComponent } from './+customer-form/customer.form';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerCurrentPointsComponent } from './customer-detail/current-points/current-points.component';
import { CustomerInfosComponent } from './customer-detail/customer-infos/customer-infos.component';
import { CustomerExpensesComponent } from './customer-detail/expenses/expenses.component';
import { CustomerLoyaltyCardComponent } from './customer-detail/loyalty-card/loyalty-card.component';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CustomerNewModal } from './customer-new/customer-new.modal';
import { CustomerScanModal } from './customer-scan/customer-scan.modal';
import { routes } from './customer.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CustomerComponent,
        DynamicCardComponent,
        CustomerFormComponent,
        CustomerDetailComponent,
        CustomerCurrentPointsComponent,
        CustomerInfosComponent,
        CustomerExpensesComponent,
        CustomerLoyaltyCardComponent,
        CustomerSearchComponent,
        CustomerNewModal,
        CustomerScanModal
    ],
    entryComponents: [
        CustomerNewModal,
        CustomerScanModal,
        CustomerLoyaltyCardComponent,
        CustomerCurrentPointsComponent,
        CustomerInfosComponent,
        CustomerExpensesComponent
    ]
})
export class CustomerModule { }