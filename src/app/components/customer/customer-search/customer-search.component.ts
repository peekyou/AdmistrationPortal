import 'rxjs/add/operator/switchMap';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AppModal } from '../../../core/shared/modals/modal';
import { TranslationService } from '../../../core/services/translation.service';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { CustomerNewModal } from '../customer-new/customer-new.modal';
import { CustomerScanModal } from '../customer-scan/customer-scan.modal';

@Component({
    selector: 'customer-search',
    styleUrls: ['./customer-search.component.scss'],
    templateUrl: './customer-search.component.html'
})
export class CustomerSearchComponent {
    modalTitle: string;
    modalSentence: string;
    modalConfirmation: string;
    loading = false;
    searchTerm: string;
    @Input() itemsPerPage: number;
    @Output() onSearch: EventEmitter<any> = new EventEmitter();
        
    constructor(
        private fb: FormBuilder, 
        private route: ActivatedRoute, 
        private router: Router, 
        private service: CustomerService,
        private translation: TranslationService,
        private modalService: NgbModal) {

        this.init();
    }
        
    init() {
        this.translation.getMultiple([
            'CUSTOMERS.NOT_FOUND',
            'CUSTOMERS.NOT_EXISTING_SENTENCE',
            'CUSTOMERS.CONFIRMATION_CREATION'], x => {
                this.modalTitle = x['CUSTOMERS.NOT_FOUND'];
                this.modalSentence = x['CUSTOMERS.NOT_EXISTING_SENTENCE'];
                this.modalConfirmation = x['CUSTOMERS.CONFIRMATION_CREATION'];
        });
    }

    searchCustomer() {
        this.loading = true;
        this.service
            .get({
                pageNumber: 1,
                itemsCount: this.itemsPerPage,
                searchTerm: this.searchTerm
            })
            .subscribe(customers => {
                if (customers.paging.totalCount === 0) {
                    this.service.searchTerm = this.searchTerm;
                    this.loading = false;
                    this.openConfirmationModal();
                }
                else if (customers.paging.totalCount === 1) {
                    this.selectCustomer(customers.data[0]);
                }
                else {
                    this.service.searchTerm = this.searchTerm;
                    this.loading = false;
                    this.onSearch.emit(customers);
                }
            },
            err => { 
                this.loading = false;
                console.log(err); 
            }
        );
    }

    openNewCustomerModal() {
        const modalRef = this.modalService.open(CustomerNewModal, { 
            // size: 'lg', 
            windowClass: 'customer-modal',
            // container: 'test'
        });

        modalRef.result.then((result) => {
            if (result === 'Y') {
            }
        }, (reason) => { });
    }

    selectCustomer(customer: Customer) {
        // Call get by id before going to detail page, to avoid two loading
        this.service.getById(customer.id)
                    .subscribe(c => {
                        this.service.customerSearched = c;
                        this.loading = false;
                        this.router.navigate(['/customers', customer.id]);
                    },
                    err => {
                        this.loading = false;
                    });
    }

    openConfirmationModal() {
        const modalRef = this.modalService.open(AppModal);
        modalRef.componentInstance.title = this.modalTitle;
        modalRef.componentInstance.text1 = this.modalSentence;
        modalRef.componentInstance.text2 = this.modalConfirmation;
        
        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.openNewCustomerModal();
            }
            else { 
                this.service.searchTerm = null;
            }
        }, (reason) => { });
    }
}