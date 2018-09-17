import { Component, Input, OnInit, ViewEncapsulation, ElementRef, HostListener } from '@angular/core';
import { D3Service, D3, Selection, Arc, PieArcDatum, BaseType, Pie } from 'd3-ng2-service';
import { PieChartData, PieChartDetail } from '../pie-chart/pie-chart';

@Component({
    selector: 'app-donut-chart',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./donut-chart.component.scss'],
    //template: ``
    template: `<svg width="100%" height="170"></svg>`
})
export class DonutChartComponent implements OnInit {
    private initialized: boolean = false;
    private d3: D3;
    private parentNativeElement: any;
    private radius: number;
    private g: Selection<BaseType, {}, HTMLElement, any>;
    private svg: Selection<Element, {}, HTMLElement, any>;
    private _data: PieChartData;
    
    @Input() svgClass: string;
    @Input() 
    set data(data: PieChartData) {
        this._data = data;
        if (!this.initialized) {
            this.initChart(this.svgClass);
        }
        this.drawChart(); 
    }

    get data(): PieChartData {
        return this._data;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        var resizeTimer;
        var interval = Math.floor(1000 / 60 * 10);
         
        window.addEventListener('resize', (event) => {
            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(() => {
                this.clear();
                this.initChart(this.svgClass);
                this.drawChart();
            }, interval);
        });
    }

    constructor(element: ElementRef, d3Service: D3Service) { 
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
    }

    ngOnInit() {
    }

    private initChart(svgContainerClass: string) {
        this.initialized = true;
        if (this.parentNativeElement != null) {
            let d3 = this.d3;
            // var width = 200;
            // var height = 200;
            // this.radius = Math.min(width, height) / 2;
            // this.svg = this.d3.select(this.parentNativeElement).append("svg")
            //     .attr("width", width)
            //     .attr("height", height);
            // this.g = this.svg.append("g")
            //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
            this.svg = this.d3.select(this.parentNativeElement).select("svg");

            var bounds = this.svg.node().getBoundingClientRect();
            var width = bounds.width;
            var height = bounds.height;
            this.radius = Math.min(width, height) / 2;
            
            this.g = this.svg.append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        }
    }

    private drawChart() {
        this.svg.selectAll(".legend").remove().exit(); 
        this.g.selectAll(".label").remove().exit(); 
        this.g.selectAll(".path").remove().exit();
        this.g.selectAll(".nodata").remove().exit();  

        if (!this.data) {
            return;
        }
        let d3 = this.d3;
        // var color = d3.scaleOrdinal()
        // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        if (this.data.name.toLowerCase() == 'gender') {
            var female = this.data.details.find(e => { return e.key == 'F' });
            var male = this.data.details.find(e => { return e.key == 'M' });
            var ukn = this.data.details.find(e => { return e.key == 'U' });
            var domain = [];
            if (female) domain.push(female.label);
            if (male) domain.push(male.label);
            if (ukn) domain.push(ukn.label);
            color = <any>d3.scaleOrdinal()
                .domain(domain)
                .range(["#ca34a2", "3ac1cd" , "#aaa"]);
        }

        var arc = d3.arc<PieArcDatum<PieChartDetail>>()
            .outerRadius(this.radius - 10)
            .innerRadius(this.radius / 1.7);
        
        var pie = d3.pie<PieChartDetail>()
        .sort(null)
        .value(function(d) { return d.count; })
        .padAngle(.03);

        if (!this.data.details || this.data.details.length == 0) {
            this.g.append("text")
            .text("No data")
            .attr("class", "nodata")
            .attr("font-size", "20px");
            return;
        }

        var tooltip = d3.select("#tooltip");
        var path = this.g.selectAll("path")
            .data(pie(this.data.details))
            .enter().append("path")
            .attr("class", "path")
            .attr("d", arc)
            .style("fill", <any>function(d) {
                return color(d.data.label); 
            })
            .on("mouseover", (d) => {
                this.showTooltip(tooltip, d);                  
            })
            .on("mouseout", (d) => {
                this.hideTooltip(tooltip);
            });
        
        // var path = arcContainer.append("path")
            
        
        // arcContainer.append("text")
        //     .attr("transform", function(d: PieArcDatum<PieChartDetail>) { return "translate(" + labelArc.centroid(d) + ")"; })
        //     .attr("dy", ".35em")
        //     .text(function(d: PieArcDatum<PieChartDetail>) { return d.data.label; });

        // Set the animation
        path.transition()
            .duration(1000)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                return function(t) {
                    return arc(interpolate(t));
                };
            });

        setTimeout(this.setLegends(pie, arc, color, tooltip), 1200);
    }

    private setLegends(pie: Pie<any, PieChartDetail>, arc, color, tooltip) {
        let d3 = this.d3;
        var text = this.g.selectAll('text')
            .data(pie(this.data.details))
            .enter().append("text")
            .on("mouseover", (d) => {
                this.showTooltip(tooltip, d);
            })
            .on("mouseout", (d) => {
                this.hideTooltip(tooltip);
            })
            .transition()
            .duration(200)
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".4em")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .text(function(d){
                return d.data.percentage == 0 ? '' : d.data.percentage.toFixed(0) +'%';
            })
            .style("fill", "#fff")
            .style("font-size", "10px");

        var legendRectSize = 15;
        var legendSpacing = 7;
        var legendHeight = legendRectSize + legendSpacing;

        var legend = this.svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                //Just a calculation for x & y position
                return 'translate(10,' + ((i*legendHeight + 5)) + ')';
            });

        legend.append('rect')
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .attr("rx", legendRectSize)
            .attr("ry", legendRectSize)
            .style("fill", color)
            .style("stroke", color);

        legend.append('text')
            .attr("x", 20)
            .attr("y", 12)
            .text(function(d: string) { return d; })
            .style("fill", "#929DAF")
            .style("font-size", "12px");
    }

    private showTooltip(tooltip, d) {
        tooltip.transition()
        .duration(200)
        .style("opacity", .9)
        .style("left", (this.d3.event.pageX - 34) + "px")
        .style("top", (this.d3.event.pageY - 12) + "px");;

        tooltip.select("strong").text(d.data.label); 
        tooltip.select("#value").text(d.data.percentage + "% (" + (<any>d).value + ")");  
    }

    private hideTooltip(tooltip) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0); 
    }

    private clear() {
        this.svg.select("g").remove();
        this.initialized = false;
    }
}