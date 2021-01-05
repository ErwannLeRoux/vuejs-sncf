<template>
    <div id="complianceTrackingChart">      
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
                right: 10,
                bottom: 20,
                left: 40
            },
            monthMap : {
                "01" : "Janvier",
                "02" : "Février",
                "03" : "Mars",
                "04" : "Avril",
                "05" : "Mai",
                "06" : "Juin",
                "07" : "Juillet",
                "08": "Août",
                "09" : "Septembre",
                "10" : "Octobre",
                "11" : "Novembre",
                "12" : "Décembre",
            },
            minY : 90
        };
    },
    props: ["dataYears","goodThreshold", "badThreshold"],
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
        },
        area(){
            return [
                {
                    lower : this.minY,
                    upper: this.badThreshold,
                    color: "red"
                },
                {
                    lower : this.badThreshold,
                    upper: this.goodThreshold,
                    color: "orange"                
                },
                {
                    lower : this.goodThreshold,
                    upper: 100,
                    color : "green"
                },
            ]
        }
    },
    watch: {
        dataYears: {
            deep : true,
            handler: function(){
                this.buildGraph()
            } 
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
        },
        buildGraph(){
            let self = this
            d3.select("#complianceTrackingSvg").remove()
            d3.select("#score-tooltip").remove()
            if(self.dataYears.length != 0){
                
                // Creation svg 
                const svg = d3.select("#complianceTrackingChart").append("svg")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+this.svgWidth+" "+this.svgHeigth)
                    .classed("svg-content", true)
                    .attr("id", "complianceTrackingSvg")
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

                xScale.domain(self.dataYears[0].values.map((d) => this.monthMap[d.month]))

                
                let color = d3.scaleOrdinal(d3.schemeDark2);
                self.dataYears.forEach((year,i) => {
                    year.color = color(i)
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
                    .attr("id","x-axis")
                    .attr("transform", "translate(0," + this.height + ")")
                    .call(xAxis)

                svg.append("g")
                    .attr("class","axis")
                    .attr("id","y-axis")
                    .call(yAxis)

                //legend axe des ordonnées 
                d3.select("#y-axis")
                    .append("text")
                    .attr("fill", "currentColor")
                    .attr("transform", "translate(-30,110) rotate(-90)")
                    .text("Taux de conformité ( en % )")

                //Creation des ajouts des zones en arriere plan
                svg.selectAll(".area")
                    .data(self.area)
                    .enter()
                    .append("g")
                    .attr("class", "area")
                    .append("rect")
                    .attr("x", 0)
                    .attr("width", self.width)
                    .attr("y", d=> yScale(d.upper))
                    .attr("height", d =>  yScale(d.lower)-yScale(d.upper))
                    .style("fill", d => d.color)
                    .attr("opacity", 0.2)
                
                //Creation et ajout des courbes en fonction du dataset    
                let line = d3.line()
                    .x(function(d){
                        return xScale(self.monthMap[d.month])+xScale.bandwidth()/2
                    })
                    .y(function(d){
                        return yScale(d.value)
                    })

                let lines = svg.selectAll("lines")
                    .data(self.dataYears)
                    .enter()
                    .append("g")
                    .attr("class", "lines")
                    .attr("id",d => "line_"+d.year)
                    .style("display", (d) => {
                        if(d.display){
                            return "inherit"
                        }else{
                            return "none"
                        }
                    })

                lines.append("path")
                    .attr("d", function(d) {
                        return line(d.values)
                    })
                    .style("fill", "none")
                    .style("stroke",d => d.color)

                //Ajout ligne pour chaque mois 
                svg.append("g")
                    .attr("id","month-lines")
                    .selectAll(".line-month")
                    .data(self.dataYears[0].values.map((d) => d.month))
                    .enter()
                    .append("line")
                    .attr("class","line-month")
                    .attr("id",d => "line-month-"+ d)
                    .style("stroke", "gray")
                    .style("stroke-width", 1)
                    .style("stroke-dasharray", ("3, 3")) 
                    .style("display","none")
                    .attr("x1", d =>  xScale(self.monthMap[d]) + xScale.bandwidth()/2)
                    .attr("y1", 0)
                    .attr("x2", d =>  xScale(self.monthMap[d]) + xScale.bandwidth()/2)
                    .attr("y2", yScale(self.minY));
                
                // Ajout des points pour chaque valeur
                svg.selectAll(".point")
                    .data(self.dataYears)
                    .enter()
                    .append("g")
                    .attr("class", "point")
                    .each(function(dy) {
                        let display ="" 
                        if(dy.display){
                            display = "inherit"
                        }else{
                            display = "none"
                        }
                        d3.select(this).selectAll("circle")
                            .data(dy.values)
                            .enter()
                            .append("circle")
                            .style("stroke", "gray")
                            .style("fill", dy.color)
                            .style("display", display)
                            .attr("r", 4)
                            .attr("cy", d => yScale(d.value))
                            .attr("cx", d => xScale(self.monthMap[d.month]) + xScale.bandwidth()/2 )
                            .style("opacity", 0.7)
                            .on("mouseover", function(e, d) {
                                d3.select(this)
                                .style("opacity", 1)
                                .style("cursor", "pointer")
                                d3.select("#line-month-"+d.month)
                                .style("display","inherit")
                                div.transition()        
                                .duration(200)      
                                .style("opacity", 0.9)
                                .style("display", "inherit")   
                                div.html("Taux de conformité : <span id='val'>"+ d.value.toFixed(2) +" %</span>")
                                .style("left", (e.pageX + 10)  + "px")     
                                .style("top", (e.pageY - 50) + "px");
                                d3.select("#val")
                                .style("color", self.getValueColor(d.value))
                                
                            })
                            .on("mouseout", function (e, d) {
                                d3.select(this).style("opacity", 0.7)
                                d3.select("#line-month-"+d.month)
                                .style("display","none")
                                div.transition()        
                                .duration(200)      
                                .style("opacity", 0)
                                .style("display", "none")   
                            })
                    })

                let legend = []
                self.dataYears.forEach((y) => {
                    if(y.display){
                        legend.push(
                            {
                                label : y.year,
                                color : y.color
                            }
                        )
                    }
                })
                self.$emit('legendChange', legend)
            }
        }
    },
    mounted: function(){
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

    #complianceTrackingChart {
        display: inline-block;
        position: relative;
        width: 100%;
        /*max-width: 600px;*/
        overflow: hidden;
    }
    
</style>



