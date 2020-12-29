<template>
    <div id="chart">       
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
    name: "ScoreOverviewChart",
    components: {

    },
    data() {
        return {
            margin : {
                top: 20,
                right: 120,
                bottom: 60,
                left: 20
            },
            
        };
    },
    computed:{
        width(){
            return 600 - this.margin.left - this.margin.right
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
        x(){
            return d3.scaleBand().range([0,this.width]).padding(0.1);
        },
        y(){
            return d3.scaleLinear().range([this.height, 0]);
        },
        data(){
            let d = {
                "average_score" : 6.554,
                "type": "global",
                "category_score": {
                    "handicap" : 2,
                    "cleanliness" : 8,
                    "wifi" : 5,
                    "salesWaiting": 5,
                    "serviceWaiting": 10 
                }
            }
            
            return d
        }
    },
    methods :{
        assignedColor(score){
            if(score < 3.33) {
                return "red"
            }
            else if(3.33 <= score && score <= 6.66){
                return "orange"
            }else{
                return "green"
            }
        }
    
    },
    props: [
    ],
    mounted: function(){
        
        let self = this

        const svg = d3.select("#chart").append("svg")
            .attr("id", "svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeigth)
            .append("g")
            .attr("transform", this.gTransform);    

        let scores = this.data.category_score

        this.x.domain(Object.keys(scores))
        this.y.domain([0,10])


        svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x).tickSize(0))
        svg.append("g")

        .call(d3.axisLeft(this.y).ticks(10))

        let tableData = []
        Object.keys(scores).forEach((key) => {
            tableData.push({
                label : key,
                score : scores[key]  
            })
        });

       

        let g = svg.selectAll(".bar")
        .data(tableData)
        .enter()
        .append("g")
        .attr("transform", d => "translate("+ this.x(d.label) +","+ this.y(d.score)+")")

        
        g.append("text").text(d => "score "+ d.score)
        .attr("class","scoreValue")
        .style("font-size","0.6em")
        .each(function(){
            d3.select(this).attr("x",self.x.bandwidth()/2 - this.getBBox().width/2 ).attr("y", -5)
        })

        g.append("rect")
        .attr("class", "bar")
        .attr("fill", d => this.assignedColor(d.score))
        .attr("opacity", 0.5)
        .attr("x", 0)
        .attr("width", this.x.bandwidth())
        .attr("y", 0)
        .attr("height", d => this.height - this.y(d.score))

        
        let gLine = svg.append("g")
        gLine.append("line")
        .style("stroke", "gray")
        .style("stroke-width", 2)
        .style("stroke-dasharray", ("3, 3")) 
        .attr("x1", 0)
        .attr("y1", this.y(this.data.average_score))
        .attr("x2", this.width)
        .attr("y2", this.y(this.data.average_score));
        gLine.append("text")
        .text("Moyenne des scores : " + this.data.average_score+ "/10")
        .attr("x", this.width)
        .attr("y", this.y(this.data.average_score))
        .style("font-size","0.6em")
    }
}
</script>

<style scoped>
</style>