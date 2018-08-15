import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
//import { ReCaptchaModule } from 'angular2-recaptcha';

import { LoginComponent } from './login/login.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { userRoutes } from './user.routing';

@NgModule({
    imports: [
        SharedModule,
        userRoutes,
    ],
    declarations: [
        LoginComponent,
        SetPasswordComponent,
        ForgetPasswordComponent
    ]
})
export class UserModule { }