import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TranslationService } from '../../core/services/translation.service';
import { SearchService } from '../../core/services/search.service';
import { SegmentationStatistics, DataType } from './segmentation-statistics';
import { StatsService } from './stats.service';
import { CustomerService } from '../customer/customer.service';
import { UserService } from '../user/user.service';
import { BarChartData, GroupBarChartData } from '../../core/shared/components/group-bar-chart/group-bar-chart';
import { PieChartData } from '../../core/shared/components/pie-chart/pie-chart';
import { Customer, CustomerExpense } from '../customer/customer';
import { SearchFilter } from '../../core/models/search-filter';
import { ReviewService } from '../review/review.service';
import { ReviewsAverage } from '../review/review';
import { Address } from '../../core/shared/components/address/address';

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
    bestCustomers: Customer[];
    loadingBestCustomer: boolean = false;
    customersHasApplicationCount: number;
    loadingCustomerHasApplicationCount: boolean = false;
    expenses: CustomerExpense[];
    getExpensesSubscription: Subscription;
    reviewsAverage: ReviewsAverage;
    loadingReviewsAverage: boolean = false;
    
    constructor(
        element: ElementRef,
        private service: StatsService,
        private translation: TranslationService,
        private searchService: SearchService,
        private customerService: CustomerService,
        private reviewService: ReviewService,
        public user: UserService) { 

            searchService.searchFilter$.subscribe(
                searchFilter => { 
                    this.reload(searchFilter);
                }
            );
        }

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

    reload(searchFilter: SearchFilter) {
        this.loadGeneralStats(searchFilter);
        this.loadingPies = true;
        this.loadSegmentationCharts(searchFilter);
        this.loadGroupedBarChart(searchFilter);
        this.getExpenses(searchFilter);
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

    loadSegmentationCharts(searchFilter: SearchFilter = null) {
        this.service.getSegmentationStatistics(searchFilter)
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

    loadGroupedBarChart(searchFilter: SearchFilter = null) {
        this.loadingGroupChart = true;
        this.barChartData = null;
        this.service.getGroupedStatistics(this.groupChartDataTypes, searchFilter)
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

    getExpenses(searchFilter: SearchFilter = null) {
        this.getExpensesSubscription = this.service
            .getExpenses(searchFilter)
            .subscribe(
                res => { this.expenses = res },
                err => { console.log(err); }
            );
    }

    hasDataType(type: DataType) {
        return this.groupChartDataTypes.indexOf(type) !== -1;
    }

    showArea() {
        return Address.showArea(this.user.getCountryCode().toLocaleLowerCase());
    }

    private loadGeneralStats(searchFilter: SearchFilter = null) {
        this.loadingCustomerCount = true;
        this.loadingTotalExpenses = true;
        this.loadingBestCustomer = true;
        this.loadingCustomerHasApplicationCount = true;
        this.loadingReviewsAverage = true;
        this.customerService.getCount({ dateFilter: searchFilter })
            .subscribe(c => {
                this.customersCount = c;
                this.loadingCustomerCount = false;
            });

        this.service.getTotalExpenses(searchFilter)
            .subscribe(res => {
                this.totalExpenses = res;
                this.loadingTotalExpenses = false;
            });

        this.service.getBestCustomers(searchFilter)
            .subscribe(res => {
                this.bestCustomers = res;
                this.loadingBestCustomer = false;
            });

        this.customerService.getCount({ hasApplication: true, dateFilter: searchFilter })
            .subscribe(c => {
                this.customersHasApplicationCount = c;
                this.loadingCustomerHasApplicationCount = false;
            });

        this.reviewService.getAverage()
            .subscribe(res => {
                this.reviewsAverage = res;
                this.loadingReviewsAverage = false;
            });
    }

    private translateLabels(data: any[]) {
        data.forEach(d => {
            var key = this.translationMapping[d.label];
            if (key) {
                d.key = d.label ? d.label : "U";
                d.label = this.staticStrings[key];
            }
        });
    }
}