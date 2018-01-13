import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'increment'
})
export class IncrementPipe implements PipeTransform {
    transform(value: string): number {
        return parseInt(value) + 1;
  }
}