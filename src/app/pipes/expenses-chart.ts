import { Pipe, PipeTransform } from '@angular/core';
import { CustomerExpense } from '../../app/components/customer/customer';
import { LineChartData } from '../core/shared/components/line-chart/line-chart';

@Pipe({
  name: 'expensesChart'
})
export class ExpensesChartPipe implements PipeTransform {
  transform(items: CustomerExpense[]): LineChartData[] {
    if (!items) {
      return null;
    }
    
    return items.map(function(expense){
        return {
          date: new Date(expense.date),
          value: expense.amount
        };
    })
    .sort(function(a,b) {
      return a.date.getTime() - b.date.getTime();
    });
  } 
}