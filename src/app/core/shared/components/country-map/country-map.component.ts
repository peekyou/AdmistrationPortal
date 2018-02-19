import { Component, Input, OnInit, Output, ViewEncapsulation,
    ViewChild, ElementRef, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { D3Service, D3, Selection, BaseType, GeoPath } from 'd3-ng2-service';
import { HttpService } from "../../../services/http.service";
// import { LineChartData } from './line-chart';

@Component({
    selector: 'app-country-map',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./country-map.component.scss'],
    templateUrl: './country-map.component.html'
})
export class CountryMapComponent implements OnInit {
    private initialized: boolean = false;
    private d3: D3;
    private parentNativeElement: any;
    private g: Selection<BaseType, {}, HTMLElement, any>;
    private svg: Selection<Element, {}, HTMLElement, any>;
    private margin = {top: 20, right: 30, bottom: 30, left: 40};
    // private _data: LineChartData[];
    
    // @Input() 
    // set data(data: LineChartData[]) {
    //     this._data = data;
    //     if (!this.initialized) {
    //         this.initialized = true;
    //         this.initChart();
    //     }
    //     this.drawChart(); 
    // }
    // get data(): LineChartData[] {
    //     return this._data;
    // }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
    }

    constructor(element: ElementRef, d3Service: D3Service, private http: HttpService) { 
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
    }

    ngOnInit() {
        this.initChart();    
    }

    initChart() {
        let d3 = this.d3;
        let margin = this.margin;
        this.svg = d3.select(".map");
            
        var projection = d3.geoMercator()
        .center([45, 55]);
        var path = d3.geoPath().projection(projection);
                
        this.g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            var json = {"type":"FeatureCollection","features":[
                {"type":"Feature","id":"ARE","properties":{"name":"United Arab Emirates"},"geometry":{"type":"Polygon","coordinates":[[[51.579519,24.245497],[51.757441,24.294073],[51.794389,24.019826],[52.577081,24.177439],[53.404007,24.151317],[54.008001,24.121758],[54.693024,24.797892],[55.439025,25.439145],[56.070821,26.055464],[56.261042,25.714606],[56.396847,24.924732],[55.886233,24.920831],[55.804119,24.269604],[55.981214,24.130543],[55.528632,23.933604],[55.525841,23.524869],[55.234489,23.110993],[55.208341,22.70833],[55.006803,22.496948],[52.000733,23.001154],[51.617708,24.014219],[51.579519,24.245497]]]}}
                ]};

                this.g.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", <any>path)
                .style("fill", "red");
                
        // var url = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/ARE.geo.json";
        // this.http.get(url)
        //     .subscribe(res => {
        //     this.g.selectAll("path")
        //         .data(res.features)
        //         .enter()
        //         .append("path")
        //         .attr("d", path)
        //         .style("fill", "red");
        // });
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