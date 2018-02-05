import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FilterByPipe } from './filter-by';
import { IncrementPipe } from './increment';
import { CurrentPointsPipe } from './current-points';
import { ExpensesChartPipe } from './expenses-chart';
import { GroupBarChartPipe } from './group-bar-chart';

const PIPES = [
    FilterByPipe,
    IncrementPipe,
    CurrentPointsPipe,
    ExpensesChartPipe,
    GroupBarChartPipe
];

@NgModule({
  imports: [CommonModule],
  exports: PIPES,
  declarations: PIPES
})
export class PipesModule { }
