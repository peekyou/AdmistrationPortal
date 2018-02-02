import { Component, Input, OnInit, Output, ViewEncapsulation,
    ViewChild, ElementRef, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { D3Service, D3, Selection, ScaleTime, ScaleLinear, BaseType } from 'd3-ng2-service';
import { LineChartData } from './line-chart';

@Component({
    selector: 'app-line-chart',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./line-chart.component.scss'],
    templateUrl: './line-chart.component.html'
})
export class LineChartComponent implements OnInit {
    private d3: D3;
    private parentNativeElement: any;
    private currency: string;
    private g: Selection<BaseType, {}, HTMLElement, any>;
    private x: ScaleTime<number, number>;
    private y: ScaleLinear<number, number>;
    private svg: Selection<Element, {}, HTMLElement, any>;
    private margin = {top: 20, right: 20, bottom: 30, left: 40};

    @Input() data: LineChartData[];

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

    ngOnInit() {
        this.currency = "AED";
        // this.data = [
        //     {date : new Date(2017, 10, 27, 11, 33, 22) , value: 10},
        //     {date : new Date(2017, 11, 8, 1, 2, 4), value: 50},
        //     // {date : new Date(2017, 11, 22), value: 770500},
        //     // {date : new Date(2017, 12, 3), value: 770400},
        //     // {date : new Date(2017, 12, 15), value: 771000},
        //     // {date : new Date(2018, 1, 7), value: 772400},
        //     // {date : new Date(2018, 1, 13), value: 774100},
        //     // {date : new Date(2018, 1, 22), value: 776700},
        //     // {date : new Date(2018, 1, 28), value: 777100},
        //     // {date : new Date(2018, 2, 8), value: 779200},
        //     // {date : new Date(2018, 4, 21), value: 782300}
        // ];
        console.log(this.data);

        if (this.parentNativeElement !== null) {
            this.initChart();
            this.drawChart();        
        }
    }

    initChart() {
        let d3 = this.d3;
        let margin = this.margin;
        this.svg = d3.select("svg");
        // var width = +this.svg.attr("width") - margin.left - margin.right;
        // var height = +this.svg.attr("height") - margin.top - margin.bottom;
            
        this.x = d3.scaleTime();
        this.y = d3.scaleLinear();
                
        this.g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
        this.g.append("g")
            .attr("class", "axis axis--x");
    
        this.g.append("g")
            .attr("class", "axis axis--y");
    }

    drawChart() {
        let d3 = this.d3;
        let margin = this.margin;
        let data = this.data;
        let g = this.g;
        let x = this.x;
        let y = this.y;
        var bounds = this.svg.node().getBoundingClientRect();
        var width = bounds.width - margin.left - margin.right;
        var height = bounds.height - margin.top - margin.bottom;

        console.log('width', width);
        console.log('hieght', height);

        var parseTime = d3.timeParse("%d-%b-%y")
        var bisectDate = d3.bisector<LineChartData, Date>(function(d) { return d.date; }).left;
        
        // data.forEach(function(d) {
        //     d.date = parseTime(d.date);
        //     d.value = +d.value;
        // });

        x.range([0, width]);
        y.range([height, 0]);
        
        var line = d3.line<LineChartData>()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });
            
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([d3.min(data, function(d) { return d.value; }) / 1.005, d3.max(data, function(d) { return d.value; }) * 1.005]);
    
        g.select(".axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(this.x));

        g.select(".axis--y")
            .call(d3.axisLeft(this.y).ticks(6).tickFormat(function(d) { return d.toString() }))
         .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text(this.currency);

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        // var lines = g.selectAll(".line").data(data);
        // var newLines = lines.enter()
        //     .append("path")
        //     .attr("class", "line");
        // lines.merge(newLines)
        //     .attr("d", line);    
    
        var focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");
    
        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);
    
        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);
    
        focus.append("circle")
            .attr("r", 7.5);
    
        focus.append("text")
            .attr("x", 15)
            .attr("dy", ".31em");
    
        this.svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", function () {
                var x0 = x.invert(d3.mouse(<any>this)[0]);
                console.log('x0', x0);
                var i = bisectDate(data, x0, 1);
                console.log('data', data);
                console.log('i', i);
                var d0 = data[i - 1];
                var d1 = data[i];
                var d = x0.valueOf() - d0.date.valueOf() > d1.date.valueOf() - x0.valueOf() ? d1 : d0;
                focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
                focus.select("text").text(function() { return d.value; });
                focus.select(".x-hover-line").attr("y2", height - y(d.value));
                focus.select(".y-hover-line").attr("x2", width + width);
            });
    }

    // update(data) {
    //     this.setSize(data);
    //     this.drawChart(data, "AED");
    // }

    // setReSizeEvent() {
    //     var resizeTimer;
    //     var interval = Math.floor(1000 / 60 * 10);
         
    //     window.addEventListener('resize', function (event) {
    //         if (resizeTimer !== false) {
    //             clearTimeout(resizeTimer);
    //         }
    //         resizeTimer = setTimeout(function () {
    //             console.log('dd');
    //             this.drawChart()
    //         }, interval);
    //     });
    // }

    // setSize(data) {
    //     width = document.querySelector("#graph").clientWidth
    //     height = document.querySelector("#graph").clientHeight
    
    //     margin = {top:40, left:60, bottom:40, right:60 }
        
    //     chartWidth = width - (margin.left+margin.right)
    //     chartHeight = height - (margin.top+margin.bottom)
        
    //     svg.attr("width", width).attr("height", height)
    //     axisLayer.attr("width", width).attr("height", height)
        
    //     chartLayer
    //         .attr("width", chartWidth)
    //         .attr("height", chartHeight)
    //         .attr("transform", "translate("+[margin.left, margin.top]+")")
            
    //     xScale.domain([new Date("2016/1/1"), new Date("2016/4/1")]).range([0, chartWidth])
    //     yScale.domain([500, d3.max(data, function(d){ return d.value})]).range([chartHeight, 0])
            
    // }
}