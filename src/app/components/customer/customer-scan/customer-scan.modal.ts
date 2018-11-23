import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { Customer, CustomerExpense } from '../customer';
import { CustomerService } from '../customer.service';
import { NotificationService } from '../../../core/shared/components/notifcations/notification.service';
import { isMobileNumber } from '../../../core/helpers/utils';

@Component({
    styleUrls: ['./customer-scan.modal.scss'],
    templateUrl: './customer-scan.modal.html'
})
export class CustomerScanModal {
    selectedDevice: any;
    error: boolean;
    availableDevices: any[];
    
    constructor(
        public activeModal: NgbActiveModal, 
        private router: Router, 
        private service: CustomerService) { }

    camerasFoundHandler($event) {
        this.availableDevices = $event;
        if ($event && $event.length > 0) {
            if ($event.length == 2) {
                this.selectedDevice = $event[1];
                
            }
            else {
                this.selectedDevice = $event[0];
            }
        }
    }
    
    scanSuccessHandler($event) {
        this.error = false;
        if ($event) {
            var customerId = $event.substr($event.lastIndexOf('/') + 1)
            this.activeModal.close();
            this.router.navigate(['/customers', customerId]);
        }
    }
    
    scanErrorHandler($event) {
        console.log($event);
        this.error = true;
    }

    onDeviceSelectChange(selectedValue: string) {
        var filtered = this.availableDevices.filter(d => d.deviceId == selectedValue);
        if (filtered && filtered.length > 0) {
            this.selectedDevice = filtered[0];
        }
    }
 }