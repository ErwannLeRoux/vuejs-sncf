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
            },
            minY : 90
        };
    },
    props: ["goodThreshold", "badThreshold"],
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
        ,
        thresholds(){
            return [
                {
                    lower : this.minY
                    ,
                    upper: this.badThreshold
                    ,
                    color: "red"
                },
                {
                    lower : this.badThreshold
                    ,
                    upper: this.goodThreshold
                    ,
                    color: "orange"                },
                {
                    lower : this.goodThreshold
                    ,
                    upper: 100
                    ,
                    color : "green"
                },
            ]
        }
    },
    methods :{ 
        getValueColor(value){
            if(value >= this.goodThreshold) {
                return "green"
            }else if (this.badThreshold <= value && value < this.goodThreshold){
                return "orange"
            }else{
                return "red"
            }
        }
    },
    mounted: function(){
        let self = this
        let dataYear = [
            {
                year: 2017,
                values: [
                    {mounth : 1, value: 90 },
                    {mounth : 2, value: 91 },
                    {mounth : 3, value: 92 },
                    {mounth : 4, value: 93 },
                    {mounth : 5, value: 94 },
                    {mounth : 6, value: 95 },
                    {mounth : 7, value: 96 },
                    {mounth : 8, value: 97 },
                    {mounth : 9, value: 98 },
                    {mounth : 10, value: 99 },
                    {mounth : 11, value: 95.5 },
                    {mounth : 12, value: 96 }
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
                    {mounth : 12, value: 95 }
                ] 
            },
        ]

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        
        // Creation svg 
        const svg = d3.select("#complianceChartCompliance").append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 "+this.svgWidth+" "+this.svgHeigth)
            .classed("svg-content", true)
            .attr("id", "svg")
            .append("g")
            .attr("transform", this.gTransform);   
    
        // creation tooltip

        let div = d3.select("body")
        .append("div")
        .attr("class", "tooltip") 
        .attr("id", "score-tooltip")        
        .style("opacity", 0);

        // Création des échelles pour chaque axes
        let xScale =  d3.scaleBand()
            .range([0,this.width])

        let yScale =  d3.scaleLinear().
            range([this.height, 0]);

        xScale.domain(dataYear[0].values.map((d) => this.mounthMap[d.mounth]))

        dataYear.forEach((year,i) => {
            year.color = color(i+1)
            let yearScore = year.values.map((x) => x.value )
            let minScore = Math.min(...yearScore)
            if(minScore <= self.minY ){
                self.minY = minScore
            }
        })

        yScale.domain([self.minY,100])

        //Creation et ajout des axes
        let xAxis = d3.axisBottom().scale(xScale).tickSize(5);
        let yAxis = d3.axisLeft().scale(yScale).tickSize(5);

        svg.append("g")
            .attr("class","axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis)

        svg.append("g")
            .attr("class","axis")
            .call(yAxis)

        //Creation et ajout des courbes en fonction du dataset    
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
            .attr("class", "lines")

        lines.append("path")
            .attr("d", function(d) {
                return line(d.values)
            })
            .style("fill", "none")
            .style("stroke",d => d.color)

        //Creation des ajouts des zones en arriere plan
        svg.selectAll(".area")
        .data(self.thresholds)
        .enter()
        .append("g")
        .attr("class", "area")
        .append("rect")
        .attr("x", 0)
        .attr("width", self.width)
        .attr("y", d=> yScale(d.upper))
        .attr("height", d =>  yScale(d.lower)-yScale(d.upper))
        .style("fill", d => d.color)
        .attr("opacity", 0.1)
        
        //Ajout ligne pour chaque mois 
        lines
        .datum(function(d) {
            return d.values
        })
        .each(function(d){
            svg.selectAll(".line-mounth")
            .data(d)
            .enter()
            .append("line")
            .attr("class","line-mounth")
            .attr("id",d => "line-mounth-"+ d.mounth)
            .style("stroke", "gray")
            .style("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3")) 
            .style("display","none")
            .attr("x1", d =>  xScale(self.mounthMap[d.mounth]) + xScale.bandwidth()/2)
            .attr("y1", 0)
            .attr("x2", d =>  xScale(self.mounthMap[d.mounth]) + xScale.bandwidth()/2)
            .attr("y2", yScale(self.minY));
        })
            
           
        // Ajout des points pour chaque valeur
        svg.selectAll(".point")
        .data(dataYear)
        .enter()
        .append("g")
        .attr("class", "point")
        .each(function(dy) {
            d3.select(this).selectAll("circle")
            .data(dy.values)
            .enter()
            .append("circle")
            .style("stroke", "gray")
            .style("fill", dy.color)
            .attr("r", 4)
            .attr("cy", d => yScale(d.value))
            .attr("cx", d => xScale(self.mounthMap[d.mounth]) + xScale.bandwidth()/2 )
            .style("opacity", 0.7)
            .on("mouseover", function(e, d) {
                d3.select(this)
                .style("opacity", 1)
                .style("cursor", "pointer")
                d3.select("#line-mounth-"+d.mounth)
                .style("display","inherit")
                div.transition()        
                .duration(200)      
                .style("opacity", 0.8);
                div.html("Taux de conformité : <span id='val'>"+ d.value +" %</span>")
                .style("left", (e.pageX + 10)  + "px")     
                .style("top", (e.pageY - 50) + "px");
                console.log(d.value)
                d3.select("#val")
                .style("color", self.getValueColor(d.value))
                
            })
            .on("mouseout", function (e, d) {
                d3.select(this).style("opacity", 0.7)
                d3.select("#line-mounth-"+d.mounth)
                .style("display","none")
                div.transition()        
                .duration(200)      
                .style("opacity", 0);
            })
        })
    }
}
</script>

<style>
    #score-tooltip{
        background-color: black;
        color:white;
        padding: 1em;
        border-radius: 5px;
    }
    
</style>

<style scoped>

    #complianceChartCompliance {
        display: inline-block;
        position: relative;
        width: 100%;
        /*max-width: 600px;*/
        overflow: hidden;
    }
    
</style>



