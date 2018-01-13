import { Component } from '@angular/core';

import { SmsService } from './sms.service';

@Component({
    styleUrls: ['./sms.component.scss'],
    templateUrl: './sms.component.html'
})
export class SmsComponent {
    packNumber: number = 1;

    constructor(private service: SmsService) { }

    onInputChange(event: KeyboardEvent) {
        if (!(event.charCode >= 48 && event.charCode <= 57)) {
            event.preventDefault();
        }
    }
}
