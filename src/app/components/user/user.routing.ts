import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'setpassword', component: SetPasswordComponent },
  { path: 'forgetpassword', component: ForgetPasswordComponent },
];

export const userRoutes = RouterModule.forChild(routes);
