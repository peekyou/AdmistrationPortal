import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {    
    loginSubscription: Subscription;
    error: string = null;
    username = this.fb.control('', Validators.required);
    password = this.fb.control('', Validators.required);

    form = this.fb.group({
        username: this.username,
        password: this.password
    });

    constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

    ngOnInit() {
        if (this.userService.isAuthenticated()) {
            this.router.navigate(['/']);
        }
    }
    
    onSumbit() {
        this.loginSubscription = this.userService.login(this.username.value, this.password.value)
            .subscribe(result => {
                if (result === true) {
                    this.router.navigate(['/']);
                } else {
                    this.error = 'Invalid credentials';
                }
            },
            err => {
                console.log(err);
                this.error = 'Invalid credentials';
            });
    }
}