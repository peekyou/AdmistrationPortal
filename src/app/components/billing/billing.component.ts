import { Component } from '@angular/core';

import { BillingService } from './billing.service';

@Component({
    styleUrls: ['./billing.component.scss'],
    templateUrl: './billing.component.html'
})
export class BillingComponent {

    constructor(private service: BillingService) { }
}
