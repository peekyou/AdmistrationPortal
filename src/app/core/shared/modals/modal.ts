import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.html'
})
export class AppModal {
    @Input() title: string;
    @Input() text1: string;
    @Input() text2: string;

    constructor(public activeModal: NgbActiveModal) { }
 }