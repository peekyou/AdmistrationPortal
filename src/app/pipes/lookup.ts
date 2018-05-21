import { Pipe, PipeTransform } from '@angular/core';
import { CustomerExpense } from '../../app/components/customer/customer';
import { Lookup } from '../core/models/lookup';

@Pipe({
  name: 'lookup'
})
export class LookupPipe implements PipeTransform {
  transform(items: string[]): Lookup[] {
    if (!items || items.length == 0) {
      return null;
    }
    return items.map(d => new Lookup(d, d));
  } 
}