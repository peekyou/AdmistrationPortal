import { Component, Input } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-submit-button',
    styleUrls: ['./submit-button.component.scss'],
    templateUrl: './submit-button.component.html'
})
export class SubmitButtonComponent {
    @Input() form: FormGroup;
    @Input() value: string;
    @Input() loadingValue: string;
    @Input() subscription: Subscription;

    constructor() { }
}