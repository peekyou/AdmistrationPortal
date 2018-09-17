import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Customer, CustomerExpense } from '../../customer';
import { CustomerService } from '../../customer.service';
import { CustomerDetailService } from '../customer-detail.service';
import { DeleteModal } from '../../../../core/shared/modals/delete.modal';

@Component({
    selector: 'app-customer-current-points',
    styleUrls: ['./current-points.component.scss'],
    templateUrl: './current-points.component.html'
})
export class CustomerCurrentPointsComponent {
    limitDeletionDate = new Date(2018, 6 , 1);
    
    constructor(
        private service: CustomerService,
        private modalService: NgbModal,
        public c: CustomerDetailService) {
    }

    openDeleteModal(expense: CustomerExpense) {
        const modalRef = this.modalService.open(DeleteModal);
        // modalRef.componentInstance.data = 'these points';

        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.deleteExpense(expense);
            }
        });
    }

    deleteExpense(expense: CustomerExpense) {
        this.service
            .deleteExpense(expense)
            .subscribe(
                res => {
                    this.c.customer = res;
                },
                err => { console.log(err); }
            );
    }

    parseDate(date: string) {
        return new Date(date);
    }
}