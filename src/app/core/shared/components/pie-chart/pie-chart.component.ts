import { Component, Input, OnInit, ViewEncapsulation, ElementRef, HostListener } from '@angular/core';
import { D3Service, D3, Selection, PieArcDatum, BaseType } from 'd3-ng2-service';
import { PieChartData, PieChartDetail } from './pie-chart';

@Component({
    selector: 'app-pie-chart',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./pie-chart.component.scss'],
    template: ``
    // template: `<svg width="100%" height="500"></svg>`
})
export class PieChartComponent implements OnInit {
    private initialized: boolean = false;
    private d3: D3;
    private parentNativeElement: any;
    private radius: number;
    private g: Selection<BaseType, {}, HTMLElement, any>;
    private svg: Selection<BaseType, {}, HTMLElement, any>;
    private _data: PieChartData;
    
    @Input() svgClass: string;
    @Input() 
    set data(data: PieChartData) {
        this._data = data;
        if (!this.initialized) {
            this.initialized = true;
            this.initChart(this.svgClass);
        }
        this.drawChart(); 
    }

    get data(): PieChartData {
        return this._data;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        // this.drawChart();
        
        // var resizeTimer;
        // var interval = Math.floor(1000 / 60 * 10);
         
        // window.addEventListener('resize', function (event) {
        //     if (resizeTimer !== false) {
        //         clearTimeout(resizeTimer);
        //     }
        //     resizeTimer = setTimeout(function () {
        //         console.log('dd');
        //         this.drawChart()
        //     }, interval);
        // });
    }

    constructor(element: ElementRef, d3Service: D3Service) { 
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
    }

    ngOnInit() { }

    private initChart(svgContainerClass: string) {
        if (this.parentNativeElement != null) {
            let d3 = this.d3;
            var width = 400;
            var height = 200;
            this.radius = Math.min(width, height) / 2;
                    
            this.svg = this.d3.select(this.parentNativeElement).append("svg")
                .attr("width", width)
                .attr("height", height);

            this.g = this.svg.append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        }
    }

    private drawChart() {
        if (!this.data) {
            return;
        }

        let d3 = this.d3;
        // var color = d3.scaleOrdinal()
        // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        
        var arc = d3.arc<PieArcDatum<PieChartDetail>>()
            .outerRadius(this.radius - 10)
            .innerRadius(0);
        
        var labelArc = d3.arc<PieArcDatum<PieChartDetail>>()
            .outerRadius(this.radius - 40)
            .innerRadius(this.radius - 40);
        
        var pie = d3.pie<PieChartDetail>()
        .sort(null)
        .value(function(d) { return d.count; });

        if (!this.data.details || this.data.details.length == 0) {
            this.svg.append("text")
            .text("No data") 
            .attr("font-size", "20px");
            return;
        }

        var tooltip = d3.select("#tooltip");
        var arcContainer = this.g.selectAll(".arc")
            .data(pie(this.data.details))
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
        
        arcContainer.append("path")
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
        
        arcContainer.append("text")
            .attr("transform", function(d: PieArcDatum<PieChartDetail>) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d: PieArcDatum<PieChartDetail>) { return d.data.label; });
    }
}