import { SharedModule } from '../../core/shared/shared.module';
import { NgModule } from '@angular/core';
//import { ReCaptchaModule } from 'angular2-recaptcha';

import { LoginComponent } from './login/login.component';
import { userRoutes } from './user.routing';

@NgModule({
    imports: [
        SharedModule,
        userRoutes,
    ],
    declarations: [
        LoginComponent
    ]
})
export class UserModule { }