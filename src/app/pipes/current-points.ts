import { Pipe, PipeTransform } from '@angular/core';
import { CustomerPoint } from '../../app/components/customer/customer';

@Pipe({
    name: 'currentPoints'
})
export class CurrentPointsPipe implements PipeTransform {

    transform(items: CustomerPoint[]): any {
        if (!items) {
            return items;
        }
        return items.filter(item => !item.isRedeemed && !item.remainder);
  }
}
