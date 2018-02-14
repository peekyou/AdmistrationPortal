import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent {
    isUAE = true;

    @Input('group')
    public addressForm: FormGroup;
    
    states = ['Abu Dhabi','Ajman','Dubai','Fujairah','Ras al-Khaimah','Sharjah','Umm al-Quwain'];

    onStateChange(value: string) {
        var val = value.split(':');
        if (val.length > 0) {
            this.addressForm.controls['city'].setValue(val[1].trim());
        }
    }
}