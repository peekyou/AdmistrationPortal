import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

    transform(items: any[], /*keys: string[],*/ term: string): any {
    //const res = items.filter(c => function () {
    //    for (var i = 0; i < keys.length; i++) {
    //        var value = c[keys[i]];
    //        if (value && value.toString().toLowerCase().indexOf(term.toLowerCase()) !== -1) {
    //            return true;
    //        }
    //    }
    //    return false;
    //}).shift();
        //return res;

        if (term) {
            term = term.toLowerCase();
        }
        return term
            ? items.filter(item => {
                var searchString = item.firstName.toLowerCase() + ' ' + item.lastName.toLowerCase();
                return searchString.indexOf(term) !== -1
            })
          : items;
  }

}
