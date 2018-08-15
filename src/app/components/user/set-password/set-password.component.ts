import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../user.service';

@Component({
    selector: 'app-set-password',
    templateUrl: './set-password.component.html',
    styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {    
    setPasswordSubscription: Subscription;
    token: string;
    code: string;
    error: boolean = false;
    redirectAlertError: boolean;
    password = this.fb.control('', Validators.minLength(8));
    passwordConfirmation = this.fb.control('', Validators.minLength(8));
    
    form = this.fb.group({
        password: this.password,
        passwordConfirmation: this.passwordConfirmation
    }, { validator: this.areEqual('password', 'passwordConfirmation') });

    constructor(
        private fb: FormBuilder, 
        private userService: UserService, 
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        if (this.userService.isAuthenticated()) {
            this.router.navigate(['/']);
        }
        else { 
            this.activatedRoute.queryParams.subscribe((params: Params) => {
                this.token = params['token'];
                this.code = params['c'];
            }); 
        }
    }
    
    areEqual(field1: string, field2: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let f1 = group.controls[field1];
            let f2 = group.controls[field2];
            if (f1.value && f2.value && f1.value !== f2.value) {
                return {
                    passwords: "Passwords should match"
                };
            }
            return {};
        }
    }

    onSumbit() {
        this.setPasswordSubscription = this.userService.setPassword(this.password.value, this.token, this.code)
            .subscribe(result => {
                this.redirectAlertError = false;
                setTimeout(()=> {       
                    this.router.navigate(['/login']);
               }, 4500);
            },
            err => {
                console.log(err);
                this.error = err.error && err.error.errorCode ? err.error.errorCode : true;
            });
    }
}