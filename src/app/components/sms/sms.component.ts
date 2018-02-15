import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SmsService } from './sms.service';
import { AppModal } from '../../core/shared/modals/modal';

@Component({
    styleUrls: ['./sms.component.scss'],
    templateUrl: './sms.component.html'
})
export class SmsComponent {
    packNumber: number = 1;
    packPrice: number = 100;
    quota = 0;

    constructor(private service: SmsService, private modalService: NgbModal) { 
        service.getQuota()
        .subscribe(
            quota => this.quota = quota,
            err => console.log(err)
        )
    }

    onInputChange(event: KeyboardEvent) {
        if (!(event.charCode >= 48 && event.charCode <= 57)) {
            event.preventDefault();
        }
    }

    openModal() {
        const modalRef = this.modalService.open(AppModal);
        modalRef.componentInstance.title = 'Buy SMS';
        modalRef.componentInstance.text1 = 'You are about to get ' + (this.packNumber * 500) + ' SMS for ' + (this.packNumber * this.packPrice) + ' AED';
        modalRef.componentInstance.text2 = 'Do you confirm?';
        
        modalRef.result.then((result) => {
            if (result === 'Y') {
                // send email
            }
        }, (reason) => { });
    }
}