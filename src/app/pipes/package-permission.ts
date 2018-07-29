import { Pipe, PipeTransform } from '@angular/core';
import { Permission } from '../../app/components/user/user';
import { UserService } from '../components/user/user.service';

@Pipe({
    name: 'packagePermission'
})
export class PackagePermissionPipe implements PipeTransform {
    
    constructor(public user: UserService) { }

    transform(items: Permission[]): any {
        if (!items) {
            return items;
        }
        return items.filter(item => this.user.getPackage() >= item.appwardsPackage);
    }
}