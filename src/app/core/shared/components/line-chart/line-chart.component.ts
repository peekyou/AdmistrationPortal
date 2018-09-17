import { Component, Input, Output, OnInit, EventEmitter,
         ViewEncapsulation, ElementRef, HostListener } from '@angular/core';
import { D3Service, D3, Selection, ScaleTime, ScaleLinear, BaseType } from 'd3-ng2-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { LineChartData } from './line-chart';
import { ngbDateStructToDate, dateToNgbDateStruct } from '../../../helpers/utils';
import { UserService } from '../../../../components/user/user.service';
import * as moment from 'moment';

@Component({
    selector: 'app-line-chart',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./line-chart.component.scss'],
    templateUrl: './line-chart.component.html'
})
export class LineChartComponent implements OnInit {
    form: FormGroup;
    private minDate: Date;
    private maxDate: Date;
    private initialized: boolean = false;
    private d3: D3;
    private parentNativeElement: any;
    private currency: string;
    private g: Selection<BaseType, {}, HTMLElement, any>;
    private x: ScaleTime<number, number>;
    private y: ScaleLinear<number, number>;
    private svg: Selection<Element, {}, HTMLElement, any>;
    private margin = {top: 20, right: 20, bottom: 50, left: 40};
    private _data: LineChartData[];
    
    // Establish the desired formatting options using locale.format():
    // https://github.com/d3/d3-time-format/blob/master/README.md#locale_format
    formatMillisecond;
    formatSecond;
    formatMinute;
    formatHour;
    formatDay;
    formatWeek;
    formatMonth;
    formatYear;

    @Input() dataSubscription: Subscription;
    
    @Input() 
    set data(data: LineChartData[]) {
        this._data = this.groupSameDay(data);
        if (!this.initialized) {
            this.initForm();
            this.initChart();
        }
        this.drawChart();
    }
    get data(): LineChartData[] {
        return this._data;
    }

    @Output() onSearch: EventEmitter<any> = new EventEmitter();    

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

    constructor(private fb: FormBuilder, element: ElementRef, d3Service: D3Service, user: UserService) {
        this.currency = user.getCurrency(); 
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
        this.form = this.fb.group({
            dateFrom: [null],
            dateTo: [null],
        }/*, { validator: this.dateLessThan('dateFrom', 'dateTo') }*/);

        var formatMeridiem = this.d3.timeFormat("%p");
        var useMeridiem = formatMeridiem(new Date) != "";
        this.formatMillisecond = this.d3.timeFormat(".%L");
        this.formatSecond = this.d3.timeFormat(":%S");
        this.formatMinute = this.d3.timeFormat("%I:%M");
        this.formatHour = useMeridiem ? this.d3.timeFormat("%I %p") : this.d3.timeFormat("%H:%M");
        this.formatDay = this.d3.timeFormat("%a %d");
        this.formatWeek = this.d3.timeFormat("%d %b");
        this.formatMonth = this.d3.timeFormat("%B");
        this.formatYear = this.d3.timeFormat("%Y");

    }

    ngOnInit() {
    }

    initChart() {
        this.initialized = true;
        if (this.parentNativeElement != null) {
            let d3 = this.d3;
            let margin = this.margin;
            this.svg = this.d3.select(this.parentNativeElement).select("svg");
                
            this.x = d3.scaleTime();
            this.y = d3.scaleLinear();
                    
            this.g = this.svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
            this.g.append("g")
                .attr("class", "axis axis--x");
        
            this.g.append("g")
                .attr("class", "axis axis--y");
        }
    }

    drawChart() {
        let d3 = this.d3;
        let _this = this;
        let margin = this.margin;
        let data = this.data;
        let g = this.g;
        let x = this.x;
        let y = this.y;
        var bounds = this.svg.node().getBoundingClientRect();
        var width = bounds.width - margin.left - margin.right;
        var height = bounds.height - margin.top - margin.bottom;
        
        g.selectAll(".area").remove().exit();
        g.selectAll(".line").remove().exit();
        g.selectAll(".circle").remove().exit();
        g.selectAll(".text").remove().exit();
        g.selectAll(".focus").remove().exit();
        this.svg.selectAll(".overlay").remove().exit();

        if (!data || data.length <= 1) {
            return;
        }

        var parseTime = d3.timeParse("%d-%b-%y")
        var bisectDate = d3.bisector<LineChartData, Date>(function(d) { return d.date; }).left;
        
        // data.forEach(function(d) {
        //     d.date = parseTime(d.date);
        //     d.value = +d.value;
        // });

        x.range([0, width]);
        y.range([height, 0]);
        
        var line = d3.line<LineChartData>()
            //.curve(d3.curveBasis)
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

            // define the area
        var area = d3.area<LineChartData>()
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.value); });
            
        x.domain(d3.extent(data, function(d) { return d.date;  }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);
    
        g.select(".axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(this.x).tickFormat(function(d) { return _this.multiFormat(d) }))
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

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

        // Add the area
        g.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);

        // Add the line
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
            .attr("class", "circle")
            .attr("r", 6);
    
        var legendContainer = focus.append("g")
             .attr("class", "legend-container");

        legendContainer.append("rect")
            .attr("class", "legend-back")
            .attr("width", 68)
            .attr("height", 35)
            .attr("x", 8)
            .attr("y", -10)
            .attr("rx", 5)
            .attr("ry", 5);
        legendContainer.append("text")
            .attr("class", "legend-date")
            .attr("x", 12)
            .attr("dy", ".31em");
        legendContainer.append("text")
            .attr("class", "legend-amount")
            .attr("x", 12)
            .attr("dy", "1.5em");
    
        this.svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { 
                focus.style("display", "none"); 
            })
            .on("mousemove", function () {
                var x0 = x.invert(d3.mouse(<any>this)[0]);
                var i = bisectDate(data, x0, 1);
                var d0 = data[i - 1];
                var d1 = data[i];
                var d = x0.valueOf() - d0.date.valueOf() > d1.date.valueOf() - x0.valueOf() ? d1 : d0;

                var legendOffset = width - x(d.date) < 60 ? -84 : 0;
                focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
                focus.select(".legend-container").attr("transform", "translate(" + legendOffset + ")");
                focus.select(".legend-date").text(function() { return d.date.toLocaleDateString(); });
                focus.select(".legend-amount").text(function() { return d.value + " " + _this.currency; });
                focus.select(".x-hover-line").attr("y2", height - y(d.value));
                focus.select(".y-hover-line").attr("x2", width + width);
            });
    }

    private clear() {
        this.svg.select("g").remove();
        this.initialized = false;
    }

    // Define filter conditions
    private multiFormat(date) {
        return (this.d3.timeSecond(date) < date ? this.formatMillisecond
        : this.d3.timeMinute(date) < date ? this.formatSecond
        : this.d3.timeHour(date) < date ? this.formatMinute
        : this.d3.timeDay(date) < date ? this.formatHour
        : this.d3.timeMonth(date) < date ? (this.d3.timeWeek(date) < date ? this.formatDay : this.formatWeek)
        : this.d3.timeYear(date) < date ? this.formatMonth
        : this.formatYear)(date);
    }

    groupSameDay(data: LineChartData[]): LineChartData[] {
        if (data && data.length > 0) {
            var result: LineChartData[] = [];
            var current = data[0];
            this.minDate = current.date;
            for (let i = 1; i < data.length; i++) {
                if (data[i].date.getDate() == current.date.getDate() &&
                    data[i].date.getMonth() == current.date.getMonth() &&
                    data[i].date.getFullYear() == current.date.getFullYear()) {
                        current.value += data[i].value;
                }
                else {
                    result.push(current);
                    current = data[i];
                }
            }
            this.maxDate = current.date;
            result.push(current);
            return result;
        }
        return null;
    }

    initForm() {
        var lastYear = new Date();
        var dateFrom = null;
        lastYear.setFullYear(lastYear.getFullYear() - 1)
        if (this.minDate > lastYear) {
            dateFrom = dateToNgbDateStruct(this.minDate);
        }
        else {
            dateFrom = dateToNgbDateStruct(lastYear);
        }
        var dateTo = dateToNgbDateStruct(this.maxDate);
        
        this.dateFrom.patchValue(dateFrom);
        this.dateTo.patchValue(dateTo);
    }

    submit() {
        var from = ngbDateStructToDate(this.dateFrom.value);
        var to = ngbDateStructToDate(this.dateTo.value);
        if (to) {
            to.setUTCHours(23);
            to.setUTCMinutes(59);
            to.setUTCSeconds(59);
        }
        this.onSearch.emit({from: from, to: to});
    }
    
    get dateFrom() { return this.form.get('dateFrom'); }
    get dateTo() { return this.form.get('dateTo'); }
}