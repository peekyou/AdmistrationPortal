import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

@Component({
    styleUrls: ['./sms-preview.modal.scss'],
    templateUrl: './sms-preview.modal.html'
})
export class SmsPreviewModal {
    @Input() smsNumber: number;
    @Input() sms: string;

    constructor(public activeModal: NgbActiveModal) { }
 }