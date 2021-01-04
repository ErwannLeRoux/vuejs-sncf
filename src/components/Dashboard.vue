<template>
    <main class="container-fluid">
        <DashboardHeader :currentYear="currentYear" :yearsList="yearsList" @selectChange="modifyCurrentYear" />
        
        <div class="row rounded shadow-sm bg-white">
            <div class="col-sm-9">
               
            </div>
            <div class="col-sm">
                <PercentSpinnerChart :percent-value="averageScore" :good-threshold="goodThreshold" :bad-threshold="badThreshold" :caption="'Taux de conformité moyen'" /> 
            </div>
        </div>
        
        <div class="row">
            <div class="col-sm">
               <Topfivetab :info="fiveBest" :stations-list="stations" />
            </div>
            <div class="col-sm">
                <Topfivetab :info="fiveWorst" :stations-list="stations" /> 
            </div>
        </div>
        <ComplianceTracking :dataYears="globalScores" :years-list="yearsList" />
    </main>
</template>

<script>
import { store } from './../storages/stations.js';
import Topfivetab from './Topfivetab.vue';
import PercentSpinnerChart from './PercentSpinnerChart.vue'
import ComplianceTracking from './ComplianceTracking.vue'
import DashboardHeader from './DashboardHeader.vue'
export default {
    name: "Dashboard",
    components: {
        Topfivetab,
        PercentSpinnerChart,
        ComplianceTracking,
        DashboardHeader,
    },
    data() {
        return {
            fiveBest : {
                title : "Nos 5 meilleures Gares",
                color : "green",    
            },
            fiveWorst : {
                title : "Nos 5 plus mauvaises Gares",
                color : "red",
            },
            goodThreshold: "95",
            badThreshold: "90",
            currentYear : null,
            yearScore : null
        };
    },
    computed:{
        maxYear(){
            let years = []
            this.globalScores.forEach((y) => {
                years.push(y.year)
            })
            return Math.max(...years)
        },
        stations(){
            return store.getters.getStations.slice(0,5);
        },
        globalScores(){
            return store.getters.getGlobalScores;
        },
        yearsList() {
            let res = []
            this.globalScores.forEach((y) => {
                if(y.year == this.currentYear){
                    res.push(
                        {
                            year : y.year,
                            select : true
                        }
                    )
                }else{
                    res.push(
                        {
                            year : y.year,
                            select : false
                        }
                    )
                }
            })
            res.sort((a,b)=>{
                    return parseInt(a.year)-parseInt(b.year)
                })
            return res
            
        },
        averageScore() {
            
            if(this.yearScore != null){
                return this.yearScore['average_score']
            }else{
                return 0
            }
        }
    },
    watch :{
        globalScores: {
            deep : true,
            handler: function(){
                this.currentYear = this.maxYear
            }
        },
        currentYear(){
            this.yearScore = this.globalScores.find(d => d.year == this.currentYear)
        }
    },
    methods :{
        modifyCurrentYear(selectedYear){
            this.currentYear = selectedYear
        }
    },
    mounted: function(){
        store.commit("getStations");
        store.commit("getGlobalScores");
    }
}
</script>

<style scoped>
    main {
        width:85%;
        margin:auto;
    }
    
</style>

