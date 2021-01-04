<template>
    <div id="spinnerChartContainer">
        <svg preserveAspectRatio="xMinYMin meet" :viewBox="'0 0 '+width+' '+height" class="svg-content">
            <g :transform="'translate('+ (width/2) +','+ (height/2) +')'">
                <g :key="area.color" v-for="area in pieAreas">
                    <path :d="dValue(area)" opacity="0.5" :style="'fill:'+area.data.color+';'">
                    </path>
                </g>
                <text text-anchor="middle" font-size="2em" y="5">{{percentValue.toFixed(2)}}%</text>
                <text text-anchor="middle" font-size="0.6em" y="20">{{caption}}</text>     
            </g>
        </svg>
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
            radius : 100,
            
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
        },
        pieAreas(){
            let pie = d3.pie()
                .sort(null)
                .value(function(d){
                return d.value
            })
            let data = pie([{value:this.percentValue,color:this.color},{value:100-this.percentValue,color:"gray"}])
            return data
        },
        
    },
    methods :{
        dValue(area){
            let arc =  d3.arc()
                .outerRadius(this.radius - 10)
                .innerRadius(this.radius - 30)
            return arc(area)
        }
    },
    mounted: function(){
    }
}
</script>

<style scoped>


     
</style>