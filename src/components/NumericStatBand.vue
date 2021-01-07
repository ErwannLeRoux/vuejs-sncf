<template>
    <div id="stats-container" class="d-flex justify-content-around align-items-center flex-wrap">
        <div class="stat rounded" :class="{'tip': (stat.tip != null) }" data-toggle="tooltip" :title="stat.tip"  :key="stat.label" v-for="stat in currentStat" >
            <div :class="'value '+stat.color">{{stat.value}}</div>
            <div :class="'label '+stat.color">{{stat.label}}</div>
        </div>
        <div id="spinner">
            <PercentSpinnerChart :percent-value="avgScore" :good-threshold="goodThreshold" :bad-threshold="badThreshold" :caption="'Taux de conformité global'" />
        </div>
    </div>
</template>
    

<script>
import jQuery from "jquery";
import PercentSpinnerChart from './PercentSpinnerChart.vue'
const $ = jQuery;
window.$ = $;

export default {
    name: "NumericStatBand",
    components: {
        PercentSpinnerChart
    },
    props: ["stats","avgScore","goodThreshold", "badThreshold", "year"],
    watch:{
        year (){
            $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            })
            this.currentStat = this.stats.find(d => d.year == this.year).stats
        }
    },
    data() {
        return {
            currentStat : [],
        };
    },
    computed:{
          
    },
    methods :{

    },
    mounted: function(){
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
        if(this.year)
            this.currentStat = this.stats.find(d => d.year == this.year).stats
    }
}
</script>

<style scoped>
    .value{
        font-size: 3em;
        opacity: 0.6;
    }
    #stats-container{
        color: #2c3e50;
        height: 100%;
        padding: 2em;
    }
    .orange{
        color:orange
    }
    .green{
        color:green
    }
    .red{
        color:red
    }

    .stat{
        width: 200px;
    }

    .tip:hover{
        cursor:pointer;
    }
     
</style>