<template>
    <div id="spinnerChartContainer">       
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
    name: "PercentSpinnerChart",
    components: {

    },
    props: ["percentValue", "goodThreshold", "badThreshold", "caption"],
    data() {
        return {
            width : 200,
            height : 200,
            radius : 100
        };
    },
    computed:{
        color(){
            if(this.percentValue >= this.goodThreshold) {
                return "green"
            }else if (this.badThreshold <= this.percentValue && this.percentValue < this.goodThreshold){
                return "orange"
            }else{
                return "red"
            }
        }
    },
    methods :{
      
    
    },
    mounted: function(){
        let arc = d3.arc()
        .outerRadius(this.radius - 10)
        .innerRadius(this.radius - 30)

        let pie = d3.pie()
        .sort(null)
        .value(function(d){
            return d.value
        }) 

        let svg = d3.select('#spinnerChartContainer').append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 "+this.width+" "+this.height)
        .classed("svg-content", true)
        .append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

        let g = svg.selectAll(".arc")
        .data(pie([{value:this.percentValue,color:this.color},{value:100-this.percentValue,color:"gray"}]))
        .enter().append("g")

        g.append("path")
        .attr("d", arc)
        .style("fill", function(d){
            return d.data.color;
        })
        .attr("opacity",0.5)
        
        g.append("text")
        .attr("text-anchor","middle")
        .attr('font-size','3em')
        .attr('y', 10)
        .text(this.percentValue + "%");

        g.append("text")
        .attr("text-anchor","middle")
        .attr('font-size','0.6em')
        .attr('y', 30)
        .text(this.caption);
    }
}
</script>

<style scoped>
    #spinnerChartContainer{
        display: inline-block;
        position: relative;
        width: 100%;
        overflow: hidden;
    }

    .svg-content {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
    }
     
</style>