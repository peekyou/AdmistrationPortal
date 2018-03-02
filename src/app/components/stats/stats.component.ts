import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TranslationService } from '../../core/services/translation.service';
import { SegmentationStatistics, DataType } from './segmentation-statistics';
import { StatsService } from './stats.service';
import { CustomerService } from '../customer/customer.service';
import { BarChartData, GroupBarChartData } from '../../core/shared/components/group-bar-chart/group-bar-chart';
import { PieChartData } from '../../core/shared/components/pie-chart/pie-chart';
import { Customer, CustomerExpense } from '../customer/customer';

@Component({
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./stats.component.scss'],
    templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {
    DataType = DataType;
    private translationMapping = {
        null: 'COMMON.UNKNOWN', 
        '': 'COMMON.UNKNOWN', 
        'M': 'COMMON.GENDER_M',
        'F': 'COMMON.GENDER_F'
    }
    private translationKeys = Object.keys(this.translationMapping).map(key => this.translationMapping[key]);    
    private staticStrings: any;
    genderPieChartData: PieChartData;
    agePieChartData: PieChartData;
    barChartData: BarChartData[] | GroupBarChartData[];
    groupChartDataTypes: DataType[] = [DataType.Gender];
    loadingGroupChart = false;
    loadingPies = false;
    customersCount: number;
    loadingCustomerCount: boolean = false;
    totalExpenses: number;
    loadingTotalExpenses: boolean = false;
    bestCustomer: Customer;
    loadingBestCustomer: boolean = false;
    expenses: CustomerExpense[];
    getExpensesSubscription: Subscription;
    
    constructor(
        element: ElementRef,
        private service: StatsService,
        private translation: TranslationService,
        private customerService: CustomerService) { }

    ngOnInit() {
        this.loadGeneralStats();

        this.loadingPies = true;
        this.translation.getMultiple(this.translationKeys, x => {
            this.staticStrings = x;
            this.loadSegmentationCharts();
            this.loadGroupedBarChart();
            this.getExpenses();
        });
    }

    selectDataType(type: DataType) {
        var index = this.groupChartDataTypes.indexOf(type);
        if (index === -1) {
            this.groupChartDataTypes.push(type);
            // Allow aonly 2 filters
            while (this.groupChartDataTypes.length > 2) {
                this.groupChartDataTypes.shift();
            }
        }
        else {
            this.groupChartDataTypes.splice(index, 1);
        }
        this.loadGroupedBarChart();
    }

    loadSegmentationCharts() {
        this.service.getSegmentationStatistics()
        .subscribe(
            stats => {
                this.translateLabels(stats.genderSegmentation.details);
                this.genderPieChartData = stats.genderSegmentation;
                this.agePieChartData = stats.ageSegmentation;
                this.loadingPies = false;
            },
            err => { console.log(err); }
        );
    }

    loadGroupedBarChart() {
        this.loadingGroupChart = true;
        this.barChartData = null;
        this.service.getGroupedStatistics(this.groupChartDataTypes)
        .subscribe(
            stats => {
                this.barChartData = stats
                this.barChartData.forEach(x => {
                    this.translateLabels(x.details);
                });
                this.translateLabels(this.barChartData);
                this.loadingGroupChart = false;
            },
            err => { console.log(err); }
        );
    }

    getExpenses(searchFilter = null) {
        this.getExpensesSubscription = this.service
            .getExpenses(searchFilter)
            .subscribe(
                res => { this.expenses = res },
                err => { console.log(err); }
            );
    }

    public hasDataType(type: DataType) {
        return this.groupChartDataTypes.indexOf(type) !== -1;
    }

    private loadGeneralStats() {
        this.loadingCustomerCount = this.loadingTotalExpenses = this.loadingBestCustomer = true;
        this.customerService.getAllCount()
            .subscribe(c => {
                this.customersCount = c;
                this.loadingCustomerCount = false;
            });

        this.service.getTotalExpenses()
            .subscribe(res => {
                this.totalExpenses = res;
                this.loadingTotalExpenses = false;
            });

        this.service.getBestCustomer()
            .subscribe(res => {
                this.bestCustomer = res;
                this.loadingBestCustomer = false;
            });
    }

    private translateLabels(data: any[]) {
        data.forEach(d => {
            var key = this.translationMapping[d.label];
            if (key) {
                d.label = this.staticStrings[key];
            }
        });
    }
}