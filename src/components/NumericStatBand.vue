<template>

    <div id="stats-container" class="d-flex justify-content-around align-items-center px-2 flex-wrap">
        <div class="stat" :class="{'tip': (stat.tip != null) }" data-toggle="tooltip" :title="stat.tip"  :key="stat.label" v-for="stat in currentStat" >
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
    }
}
</script>

<style scoped>
    .value{
        font-size: 3em;
    }
    #stats-container{
        height: 50%;
        color: #2c3e50;
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
    .value{
        opacity: 0.6;
    }
    .stat{
        width:200px;
        margin:1em
    }

    .tip{
        cursor:pointer;
    }
     
</style>