import {
    Router, CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';

import { UserService } from '../components/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate, CanActivateChild {

    constructor(private user: UserService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var permission: string = route && route.data["permission"] ? route.data["permission"] : null;
        if (this.user.hasPermission(permission)) {
            return true;
        }
        this.router.navigate(['/customers']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

}

