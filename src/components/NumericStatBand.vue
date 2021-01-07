<template>
    <div id="stats-container" class="d-flex align-items-center flex-wrap">
        <div class="stat rounded" :class="{'tip': (stat.tip != null) }" data-toggle="tooltip" :title="stat.tip"  :key="stat.label" v-for="stat in currentStat" >
            <div :class="'value '+stat.color">{{stat.value}}</div>
            <div :class="'label '+stat.color">{{stat.label}}</div>
        </div>
    </div>
</template>
    

<script>
import jQuery from "jquery";
const $ = jQuery;
window.$ = $;

export default {
    name: "NumericStatBand",
    components: {

    },
    props: ["stats", "year"],
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
        width:50%
    }
    
    .stat .label{
        width:50%;
        margin:auto
    }

    .tip:hover{
        background-color: lightgray ;
        cursor:pointer;
    }
     
</style>