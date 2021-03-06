import { Component, Input, OnInit, ViewEncapsulation, ElementRef, HostListener } from '@angular/core';
import { D3Service, D3, Selection, BaseType, ScaleBand, ScaleLinear, ScaleOrdinal } from 'd3-ng2-service';
import { BarChartData, GroupBarChartData, ChartData } from './group-bar-chart';

import { UserService } from '../../../../components/user/user.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-group-bar-chart',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./group-bar-chart.component.scss'],
    templateUrl: './group-bar-chart.component.html'
})
export class GroupBarChartComponent implements OnInit {
    private initialized: boolean = false;
    private d3: D3;
    private parentNativeElement: any;
    private averageBasketMessage: string = '';
    private currency: string;
    private maxBarWidth = 150;
    private width: number;
    private height: number;
    private g: Selection<BaseType, {}, HTMLElement, any>;
    private svg: Selection<Element, {}, HTMLElement, any>;
    private x0: ScaleBand<string>;
    private x1: ScaleBand<string>;
    private y: ScaleLinear<number, number>;
    private z: ScaleOrdinal<string, {}>;
    private margin = {top: 20, right: 20, bottom: 100, left: 40};
    private dataKeys: string[] = [];
    private showLegend = true;

    private _data: ChartData[];
    
    @Input() 
    set data(data: ChartData[]) {
        this._data = data;
        if (!data) {
            this.clearData();
        }
        else if (this.initialized) {
            this.setDataKeys();
            this.drawChart(); 
        }
    }
    get data(): ChartData[] {
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
                this.initChart();
                this.drawChart();
            }, interval);
        });
    }

    constructor(element: ElementRef, d3Service: D3Service, user: UserService, private translation: TranslationService) {
        this.currency = user.getCurrency();
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
    }

    ngOnInit() {
        if (this.parentNativeElement !== null) {
            this.translation.get('STATS.AVERAGE_BASKET', x => {
                this.averageBasketMessage = x;
                this.initChart();
                this.drawChart(); 
            });    
        }
    }

    setDataKeys() {
        if (this.isGroupedChart()) {
            this.dataKeys = [];
            this.showLegend = true;
            var data = <GroupBarChartData[]>this._data;
            data.forEach(d => {
                d.details.forEach(s => {
                    if (this.dataKeys.indexOf(s.label) === -1) {
                        this.dataKeys.push(s.label);
                    }
                    if (d.details.length > 6) {
                        this.showLegend = false;
                    } 
                });
            });
        }
    }

    initChart() {
        let d3 = this.d3;
        let margin = this.margin;
        let keys = this.dataKeys;
        this.svg = this.d3.select(this.parentNativeElement).select("svg");
        
        var bounds = this.svg.node().getBoundingClientRect();
        this.width = bounds.width - margin.left - margin.right;
        this.height = bounds.height - margin.top - margin.bottom;
                
        this.x0 = d3.scaleBand()
            .rangeRound([0, this.width])
            .paddingInner(0.1);
        
        this.x1 = d3.scaleBand().padding(0.05);
        this.x1.domain(keys).rangeRound([0, this.x0.bandwidth()]);
        
        this.y = d3.scaleLinear()
            .rangeRound([this.height, 0]);
        
        this.z = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        this.g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        this.g.append("g")
            .attr("class", "axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x0))
            .attr("font-size", ".8em");
    
        this.g.append("g")
            .attr("class", "axis--y")
            .call(d3.axisLeft(this.y).ticks(null, "s"))
            .append("text")
            .attr("x", 115)
            .attr("transform", "rotate(-360)")
            .attr("y", 0)
            .attr("dy", "-0.2em")
            .attr("fill", "#000")
            .attr("text-anchor", "end")
            .text(this.averageBasketMessage + " (" + this.currency + ")")
            .attr("font-size", "1.2em");

        this.initialized = true;
    }

    drawChart() {
        if (!this._data) {
            return;
        }

        let d3 = this.d3;
        let margin = this.margin;
        let data = this._data;
        let width = this.width;
        let height = this.height;
        let g = this.g;
        let x0 = this.x0;
        let x1 = this.x1;
        let y = this.y;
        let z = this.z;
        let keys = this.dataKeys;
        let tooltip = d3.select("#tooltip");

        var yDomainFn = (d) => {
            if (this.isGroupedChart()) {
                return d3.max(keys, function(key) { 
                    var res = d.details.filter(x => x.label == key);
                    if (!res || res.length == 0) {
                        return null;
                    }
                    else {
                        return res[0].value
                    }
                });
            }
            return d.value;
        }

        x0.domain(data.map(function(d) { return d.label; }));
        y.domain([0, d3.max(data, yDomainFn)]).nice();
        
        if (this.isGroupedChart()) {
            x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        }

        g.selectAll(".bars")
            .remove()
            .exit();
        g.selectAll(".bar")
            .remove()
            .exit();
        g.selectAll(".legend")
            .remove()
            .exit();

        if (this.isGroupedChart()) {
            g.append("g")
                .attr("class", "bars")
                .selectAll("g")
                .data<GroupBarChartData>(<GroupBarChartData[]>data)
                .enter().append("g")
                .attr("transform", function(d) { return "translate(" + x0(d.label) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return keys.map(function(key) { 
                    var item = d.details.filter(x => x.label == key)[0];
                    return {
                        key: key, 
                        value: item ? item.value : null,
                        label: d.label + " " + key
                    }; 
                }); })
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d: any) { return x1(d.key); })
                .attr("y", function(d: any) { return y(d.value); })
                .attr("width", x1.bandwidth())
                .attr("height", function(d: any) { return height - y(d.value); })
                .attr("fill", <any>function(d: any) { return z(d.key); });
        }
        else {
            g.selectAll(".bar")
                .data<BarChartData>(<BarChartData[]>data)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x0(d.label); })
                .attr("y", function(d) { return y(d.value); })
                .attr("width", x0.bandwidth())
                .attr("height", function(d) { return height - y(d.value); })
                .attr("fill", <any>function(d) { return z(d.label); });
        }

        this.g.select(".axis--x").call(d3.axisBottom(x0))
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")
            .text((d: string) => this.cutWords(d));

        this.g.select(".axis--y").call(d3.axisLeft(y));
        
        if (this.showLegend && this.isGroupedChart()) {
            var legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", "1.2em")
                .attr("text-anchor", "end")
                .attr("class", "legend")
                .selectAll("g")
                .data(keys.slice().reverse())
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
            
            legend.append("rect")
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", <any>z);
            
            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .attr("font-size", "0.6em")
                .text((d: string) => this.cutWords(d));
        }

        if (!tooltip.empty()) {
            this.g.selectAll(".bar")
            .on("mouseover", (d: BarChartData) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                    
                    tooltip.select("strong").text(d.label); 
                    tooltip.select("#value").text(d.value + " " + this.currency);                    
                })
            .on("mouseout", d => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            });
        }
    }

    clearData() {
        if (this.g) {
            this.g.selectAll(".bars")
                .remove()
                .exit();
            this.g.selectAll(".bar")
                .remove()
                .exit();
            this.g.selectAll(".legend")
                .remove()
                .exit();
        }
    }

    isGroupedChart(): boolean {
        return this._data && this._data.length > 0 && this._data[0] instanceof GroupBarChartData;
    }

    private clear() {
        this.svg.select("g").remove();
        this.initialized = false;
    }

    private cutWords(s: string) {
        if (s && s.length > 13) {
            return s.substring(0, 11) + '...';
        }
        return s;
    }
}