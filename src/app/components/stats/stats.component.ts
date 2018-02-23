import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { D3Service, D3, Selection, PieArcDatum, BaseType } from 'd3-ng2-service';

import { TranslationService } from '../../core/services/translation.service';
import { SegmentationStatistics, Segmentation, SegmentationDetail, DataType } from './segmentation-statistics';
import { StatsService } from './stats.service';
import { CustomerService } from '../customer/customer.service';
import { BarChartData, GroupBarChartData } from '../../core/shared/components/group-bar-chart/group-bar-chart';
import { Customer } from '../customer/customer';

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
    private d3: D3;
    private parentNativeElement: any;
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
    
    constructor(
        element: ElementRef,
        d3Service: D3Service, 
        private service: StatsService,
        private translation: TranslationService,
        private customerService: CustomerService) { 

            this.d3 = d3Service.getD3();
            this.parentNativeElement = element.nativeElement;
    }

    ngOnInit() {
        this.loadGeneralStats();

        if (this.parentNativeElement !== null) {
            this.loadingPies = true;
            this.translation.getMultiple(this.translationKeys, x => {
                this.staticStrings = x;
                this.service
                .getSegmentationStatistics()
                .subscribe(
                    stats => {
                        this.buildPies(stats);
                        this.loadingPies = false;
                    },
                    err => { console.log(err); }
                );

                this.updateGroupedBarChart();
            });
        }

        // this.barChartData = [
        //     { label: "Male", value: 5 },
        //     { label: "Female", value: 8 }
        // ];
    }

    buildPies(data: SegmentationStatistics) {
        // if (data.ageSegmentation) {
        //     data.ageSegmentation = {
        //         name: 'Age',
        //         details: [
        //             { label: '0', count: 10, percentage: 27 },
        //             { label: '25-35', count: 17, percentage: 36 },
        //             { label: '35-50', count: 17, percentage: 36 },
        //             { label: '+50', count: 2, percentage: 5 },
        //         ]
        //     };
        // };

        
        // if (!data.genderSegmentation) {
        //     data.genderSegmentation = {
        //         name: 'Gender',
        //         details: [
        //             { label: 'F', count: 10 },
        //             { label: 'M', count: 17 },
        //         ]
        //     };
        // }

        this.translateLabels(data.genderSegmentation.details);
        this.buildPie(data.genderSegmentation, 'gender-stats');
        this.buildPie(data.ageSegmentation, 'age-stats');
    }
    
    buildPie(data: Segmentation, svgContainerClass: string) {
        var info = this.initPieChart(svgContainerClass);
        this.updatePieChart(data, info.svg, info.radius);
    }

    private initPieChart(svgContainerClass: string) {
        let d3 = this.d3; // <-- for convenience use a block scope variable
        let d3ParentElement: Selection<any, any, any, any>; // <-- Use the Selection interface (very basic here for illustration only)
        
        d3ParentElement = d3.select(this.parentNativeElement); // <-- use the D3 select method 
        
        var width = 400;
        var height = 200;
        var radius = Math.min(width, height) / 2;
                
        var svg = d3.select('.' + svgContainerClass + ' svg');
        if (svg.empty()) {
            svg = d3.select('.' + svgContainerClass).append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        }
        return { svg: svg, radius: radius };
    }

    private updatePieChart(data: Segmentation, svg: Selection<BaseType, {}, HTMLElement, any>, radius: number) { 
        let d3 = this.d3;
        // var color = d3.scaleOrdinal()
        // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        
        var arc = d3.arc<PieArcDatum<SegmentationDetail>>()
            .outerRadius(radius - 10)
            .innerRadius(0);
        
        var labelArc = d3.arc<PieArcDatum<SegmentationDetail>>()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);
        
        var pie = d3.pie<SegmentationDetail>()
        .sort(null)
        .value(function(d) { return d.count; });

        if (!data.details || data.details.length == 0) {
            svg.append("text")
            .text("No data") 
            .attr("font-size", "20px");
            return;
        }

        var tooltip = d3.select("#tooltip");
        var g = svg.selectAll(".arc")
            .data(pie(data.details))
            .enter().append("g")
            .attr("class", "arc")
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .style("left", (d3.event.pageX - 34) + "px")
                    .style("top", (d3.event.pageY - 12) + "px");;

                    tooltip.select("strong").text(d.data.label); 
                    tooltip.select("#value").text(d.data.percentage + "% (" + (<any>d).value + ")");                    
                })
            .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            });
        
        g.append("path")
            .attr("d", arc)
            .style("fill", <any>function(d) { 
                if (d.data.label == "Female") {
                    return "rgb(251,180,174)";
                }
                else if (d.data.label == "Male") {
                    return "rgb(179,205,227)";
                }
                else if (d.data.label == "Unknown") {
                    return "rgb(221,221,221)";
                }
                return color(d.data.label); 
            });
        
        g.append("text")
            .attr("transform", function(d: PieArcDatum<SegmentationDetail>) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d: PieArcDatum<SegmentationDetail>) { return d.data.label; });
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
        this.updateGroupedBarChart();
    }

    updateGroupedBarChart() {
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

        // if (this.genderGroupChecked && this.ageGroupChecked) {
        //     this.barChartData = [
        //        new GroupBarChartData("Male", [
        //             { label: "Under 5", value: 5 },
        //             { label: "5-20", value: 15 },
        //             { label: "20-35", value: 35 },
        //             { label: "35-40", value: 5 },
        //             { label: "40-50", value: 15 },
        //             { label: "Above 50", value: 35 }
        //         ]),
        //         new GroupBarChartData("Female", [
        //             { label: "Under 5", value: 15 },
        //             { label: "5-20", value: 25 },
        //             { label: "20-35", value: 105 },
        //             { label: "35-40", value: 2 },
        //             { label: "40-50", value: 45 },
        //             { label: "Above 50", value: 15 }
        //         ])
        //     ];
        // }
        // else if (this.ageGroupChecked) {
        //     this.barChartData = [
        //         { label: "Under 5", value: 15 },
        //         { label: "5-20", value: 25 },
        //         { label: "20-35", value: 105 },
        //         { label: "35-40", value: 2 },
        //         { label: "40-50", value: 45 },
        //         { label: "Above 50", value: 15 }
        //     ];
        // }
        // else {
        //     this.barChartData = [
        //         { label: "Male", value: 5 },
        //         { label: "Female", value: 8 }
        //     ];
        // }
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