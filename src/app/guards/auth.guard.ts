import {
    Router, CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../../app/components/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private user: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.user.isAuthenticated()) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

}

