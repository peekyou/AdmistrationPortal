import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'delete-modal',
    templateUrl: './delete.modal.html'
})
export class DeleteModal {
    @Input() data: string;

    constructor(public activeModal: NgbActiveModal) { }
 }