import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FilterByPipe } from './filter-by';
import { IncrementPipe } from './increment';
import { CurrentPointsPipe } from './current-points';
import { ExpensesChartPipe } from './expenses-chart';

const PIPES = [
    FilterByPipe,
    IncrementPipe,
    CurrentPointsPipe,
    ExpensesChartPipe
];

@NgModule({
  imports: [CommonModule],
  exports: PIPES,
  declarations: PIPES
})
export class PipesModule { }
