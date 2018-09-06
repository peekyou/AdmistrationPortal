import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-submit-button',
    styleUrls: ['./submit-button.component.scss'],
    templateUrl: './submit-button.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SubmitButtonComponent implements OnInit {
    @Input() buttonClass: string;
    @Input() buttonType: string;
    @Input() form: FormGroup;
    @Input() value: string;
    @Input() loadingValue: string;
    @Input() subscription: Subscription;

    constructor() { }

    ngOnInit() {
        if (!this.buttonClass) {
            this.buttonClass = 'btn btn-primary';
        }
        
        if (!this.buttonType) {
            this.buttonType = 'submit';
        }
    }
}