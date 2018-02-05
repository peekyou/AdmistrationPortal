import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { D3Service, D3, Selection, PieArcDatum, BaseType } from 'd3-ng2-service';

import { TranslationService } from '../../core/services/translation.service';
import { SegmentationStatistics, Segmentation, SegmentationDetail, DataType } from './segmentation-statistics';
import { StatsService } from './stats.service';
import { BarChartData, GroupBarChartData } from '../../core/shared/components/group-bar-chart/group-bar-chart';

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
    private groupChartDataTypes: DataType[] = [DataType.Gender];
    // private genderGroupChecked: boolean = true;
    // private ageGroupChecked: boolean = false;
    private barChartData: BarChartData[] | GroupBarChartData[];
    
    constructor(
        element: ElementRef,
        d3Service: D3Service, 
        private service: StatsService,
        private translation: TranslationService) { 

            this.d3 = d3Service.getD3();
            this.parentNativeElement = element.nativeElement;
    }

    ngOnInit() {
        if (this.parentNativeElement !== null) {
            
            this.translation.getMultiple(this.translationKeys, x => {
                this.staticStrings = x;
                this.service
                .getSegmentationStatistics()
                .subscribe(
                    stats => this.buildPies(stats),
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
        if (!data.ageSegmentation) {
            data.ageSegmentation = {
                name: 'Age',
                details: [
                    { label: '0', count: 10 },
                    { label: '25-35', count: 17 },
                    { label: '35-50', count: 17 },
                    { label: '+50', count: 2 },
                ]
            };
        };

        
        if (!data.genderSegmentation) {
            data.genderSegmentation = {
                name: 'Gender',
                details: [
                    { label: 'F', count: 10 },
                    { label: 'M', count: 17 },
                ]
            };
        }

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
        
        var width = 460;
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
        var color = d3.scaleOrdinal(d3.schemeCategory20c);
        
        var arc = d3.arc<PieArcDatum<SegmentationDetail>>()
            .outerRadius(radius - 10)
            .innerRadius(0);
        
        var labelArc = d3.arc<PieArcDatum<SegmentationDetail>>()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);
        
        var pie = d3.pie<SegmentationDetail>()
        .sort(null)
        .value(function(d) { return d.count; });

        var div = d3.select("#tooltip");
        var g = svg.selectAll(".arc")
            .data(pie(data.details))
            .enter().append("g")
            .attr("class", "arc")
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9)
                // div.text((<any>d).value)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

                    div.select("strong").text(data.name); 
                    div.select("#value").text(d.data.percentage + "% (" + (<any>d).value + ")");                    
                })
            .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            });
        
        g.append("path")
            .attr("d", arc)
            .style("fill", <any>function(d) { return color(d.data.label); });
        
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
        this.service.getGroupedStatistics(this.groupChartDataTypes)
        .subscribe(
            stats => {
                this.barChartData = stats
                this.barChartData.forEach(x => {
                    this.translateLabels(x.details);
                });
                this.translateLabels(this.barChartData);
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

    private translateLabels(data: any[]) {
        data.forEach(d => {
            var key = this.translationMapping[d.label];
            if (key) {
                d.label = this.staticStrings[key];
            }
        });
    }
}