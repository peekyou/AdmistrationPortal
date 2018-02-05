import { Pipe, PipeTransform } from '@angular/core';
import { CustomerExpense } from '../../app/components/customer/customer';
import { BarChartData, GroupBarChartData } from '../core/shared/components/group-bar-chart/group-bar-chart';

@Pipe({
  name: 'groupBarChart'
})
export class GroupBarChartPipe implements PipeTransform {
  transform(items: GroupBarChartData[], isGroup: boolean): BarChartData[] | GroupBarChartData[] {
    if (!items || items.length == 0) {
      return null;
    }
    
    if (!isGroup) {
      return items[0].details.map(d => {
          return new BarChartData(d.label, +d.value);
      });
    }
    
    return items.map(x => {
      return new GroupBarChartData(
        x.label,
        x.details.map(d => {
          return new BarChartData(d.label, +d.value);
        })
      );
    });
  } 
}