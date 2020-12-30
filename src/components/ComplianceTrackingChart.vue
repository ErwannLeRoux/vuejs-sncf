<template>
    <div id="complianceChartCompliance">       
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
    name: "ComplianceTrackingChart",
    components: {

    },
    data() {
        return {
            margin : {
                top: 20,
                right: 120,
                bottom: 60,
                left: 40
            },
            mounthMap : {
                1 : "Janvier",
                2 : "Février",
                3 : "Mars",
                4 : "Avril",
                5 : "Mai",
                6 : "Juin",
                7 : "Juillet",
                8 : "Août",
                9 : "Septembre",
                10 : "Octobre",
                11 : "Novembre",
                12 : "Décembre",
            }
        };
    },
    computed:{
         width(){
            return 1000 - this.margin.left - this.margin.right
        },
        height(){
            return 400 - this.margin.top - this.margin.bottom
        },
        svgWidth(){
            return this.width + this.margin.left + this.margin.right            
        },
        svgHeigth(){
            return this.height + this.margin.top + this.margin.bottom            
        },
        gTransform(){
            return "translate(" + this.margin.left + "," + this.margin.top + ")"       
        }
    },
    methods :{
      
    
    },
    mounted: function(){
        let self = this
        let dataYear = [
            {
                year: 2017,
                values: [
                    {mounth : 1, value: 90 },
                    {mounth : 2, value: 91 },
                    {mounth : 3, value: 95 },
                    {mounth : 4, value: 94 },
                    {mounth : 5, value: 95 },
                    {mounth : 6, value: 95.5 },
                    {mounth : 7, value: 95.6 },
                    {mounth : 8, value: 95.6 },
                    {mounth : 9, value: 94.1 },
                    {mounth : 10, value: 93.5 },
                    {mounth : 11, value: 99.7 },
                    {mounth : 12, value: 95 }
                ] 
            },
            {
                year: 2018,
                values: [
                    {mounth : 1, value: 81 },
                    {mounth : 2, value: 88 },
                    {mounth : 3, value: 86 },
                    {mounth : 4, value: 99 },
                    {mounth : 5, value: 99 },
                    {mounth : 6, value: 97},
                    {mounth : 7, value: 95.6 },
                    {mounth : 8, value: 96 },
                    {mounth : 9, value: 94.3},
                    {mounth : 10, value: 92.15 },
                    {mounth : 11, value: 98.1 },
                    {mounth : 12, value: 81 }
                ] 
            },
        ]

        

        const svg = d3.select("#complianceChartCompliance").append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 "+this.svgWidth+" "+this.svgHeigth)
            .classed("svg-content", true)
            .attr("id", "svg")
            .append("g")
            .attr("transform", this.gTransform);   
    
        let xScale =  d3.scaleBand()
            .range([0,this.width])

        let yScale =  d3.scaleLinear().
            range([this.height, 0]);

        xScale.domain(dataYear[0].values.map((d) => this.mounthMap[d.mounth]))

        let minY = 80

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        
        dataYear.forEach((year,i) => {
            year.color = color(i+1)
            let yearScore = year.values.map((x) => x.value )
            let minScore = Math.min(...yearScore)
            if(minScore <= minY ){
                minY = minScore
            }
        })

        yScale.domain([minY,100])

        let xAxis = d3.axisBottom().scale(xScale).tickSize(5);
        let yAxis = d3.axisLeft().scale(yScale).tickSize(5);

        svg.append("g")
            .attr("class","axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis)

        svg.append("g")
            .attr("class","axis")
            .call(yAxis)

        let line = d3.line()
            .x(function(d){
                return xScale(self.mounthMap[d.mounth])+xScale.bandwidth()/2
            })
            .y(function(d){
                return yScale(d.value)
            })

        let lines = svg.selectAll("lines")
            .data(dataYear)
            .enter()
            .append("g")

        lines.append("path")
            .attr("d", function(d) {
                return line(d.values)
            })
            .style("fill", "none")
            .style("stroke",d => d.color)

        lines.append("text")
            .attr("class","serie_label")
            .datum(function(d) {
                return {
                    year: d.year,
                    value: d.values[d.values.length - 1]}; 
                })
            .attr("x", 5)
            .text(d => d.year)
            .attr("transform", function(d) {
                let y = xScale(self.mounthMap[d.value.mounth]) + xScale.bandwidth()/2
                return "translate(" 
                    + y
                    + ","+ 
                    + yScale(d.value.value)
                    +")";
            })
    }
}
</script>

<style scoped>
    #complianceChartCompliance {
        display: inline-block;
        position: relative;
        width: 100%;
        /*max-width: 600px;*/
        overflow: hidden;
    }
    path{
        fill:none;
        stroke: #ed3700
    }
</style>



