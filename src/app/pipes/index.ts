import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FilterByPipe } from './filter-by';
import { SafePipe } from './safe';
import { IncrementPipe } from './increment';
import { CurrentPointsPipe } from './current-points';
import { ExpensesChartPipe } from './expenses-chart';
import { GroupBarChartPipe } from './group-bar-chart';
import { CountryPipe } from '../core/shared/components/intl-phone-number/country.pipe';

const PIPES = [
    FilterByPipe,
    SafePipe,
    IncrementPipe,
    CurrentPointsPipe,
    ExpensesChartPipe,
    GroupBarChartPipe,
    CountryPipe
];

@NgModule({
  imports: [CommonModule],
  exports: PIPES,
  declarations: PIPES
})
export class PipesModule { }
