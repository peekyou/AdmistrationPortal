import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Customer } from '../../customer';
import { CustomerService } from '../../customer.service';
import { CustomerDetailService } from '../customer-detail.service';
import { dateToNgbDateStruct } from '../../../../core/helpers/utils';
import { NotificationService } from '../../../../core/shared/components/notifcations/notification.service';

@Component({
    selector: 'app-customer-infos',
    styleUrls: ['./customer-infos.component.scss'],
    templateUrl: './customer-infos.component.html'
})
export class CustomerInfosComponent {
    currency: string;
    customerForm: FormGroup;
    saveSubscription: Subscription;

    constructor(
        private service: CustomerService,
        private notifications: NotificationService,
        public c: CustomerDetailService) {
    }

    populateUser(form: FormGroup = null) {
        if (form) {
            this.customerForm = form;
        }
        if (this.customerForm) {
            this.customerForm.reset();
            const languagesControl = <FormArray>this.customerForm.controls['languages'];
            const favoriteProductsControl = <FormArray>this.customerForm.controls['favoriteProducts'];
            this.clearFormArray(languagesControl);
            this.clearFormArray(favoriteProductsControl);
            this.customerForm.patchValue({
                gender: this.c.customer.gender,
                firstname: this.c.customer.firstname,
                lastname: this.c.customer.lastname,
                mobile: this.c.customer.mobileNumber,
                email: this.c.customer.email,
                // languages: this.c.customer.languages,
                birthdate: dateToNgbDateStruct(this.c.customer.birthdate),
                comment: this.c.customer.comment,
                customField1: this.c.customer.customField1,
                customField2: this.c.customer.customField2,
                customField3: this.c.customer.customField3
            });

            if (this.c.customer.address) {
                this.customerForm.patchValue({
                   address: {
                        country: this.c.customer.address.country,
                        addressLine1: this.c.customer.address.addressLine1,
                        addressLine2: this.c.customer.address.addressLine2,
                        city: this.c.customer.address.city,
                        area: this.c.customer.address.area,
                        zipCode: this.c.customer.address.zipCode,
                        state: this.c.customer.address.state
                    }
                });
            }
            
            // Set languages
            for (let i = 0; this.c.customer.languages && i < this.c.customer.languages.length; i++) {
                let newLanguage = new FormControl(this.c.customer.languages[i]);
                languagesControl.push(newLanguage);
            }
            // If there is no language, add an empty control
            if (languagesControl.length == 0 ) {
                languagesControl.push(new FormControl());                
            }
            
            // Set fav products
            for (let i = 0; this.c.customer.favoriteProducts && i < this.c.customer.favoriteProducts.length; i++) {
                let newProduct = new FormControl(this.c.customer.favoriteProducts[i]);
                favoriteProductsControl.push(newProduct);
            }
            if (favoriteProductsControl.length == 0 ) {
                favoriteProductsControl.push(new FormControl());                
            }
        }
    }
    
    saveCustomer(customer: Customer) {
        // Merge the data coming from the form to the current customer
        Object.assign(this.c.customer, customer);
        this.saveSubscription = this.service
            .update(this.c.customer)
            .subscribe(
                id => { },
                err => { 
                    console.log(err);
                    this.notifications.setErrorNotification();
                 }
        );
    }

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }
}