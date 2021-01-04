<template>
    <div id="main" class="container-fluid pb-4">
        <DashboardHeader :currentYear="currentYear" :yearsList="yearsList" @selectChange="modifyCurrentYear" />
        <div class="container-fluid rounded shadow-sm bg-white my-2">
            <div class="row">
                <div class="col-sm-9">
               
                </div>
                <div class="col-sm">
                    <PercentSpinnerChart :percent-value="averageScore" :good-threshold="goodThreshold" :bad-threshold="badThreshold" :caption="'Taux de conformité moyen'" /> 
                </div>
            </div>
            
        </div>
        <DashboardStationsTop :year="currentYear" />
        <div class="container-fluid mt-4 p-0">
            <h4 id="#chartTitle">Suivi du taux de conformité de la SNCF à l'année</h4>
            <ComplianceTracking :dataYears="globalScores" :years-list="yearsList" />
        </div>
    </div>
</template>

<script>
import { store } from './../storages/stations.js';
import PercentSpinnerChart from './PercentSpinnerChart.vue'
import ComplianceTracking from './ComplianceTracking.vue'
import DashboardHeader from './DashboardHeader.vue'
import DashboardStationsTop from './DashboardStationsTop.vue'
export default {
    name: "Dashboard",
    components: {
        PercentSpinnerChart,
        ComplianceTracking,
        DashboardHeader,
        DashboardStationsTop,
    },
    data() {
        return {
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
    #main {
        width:85%;
        margin:auto;
        padding:0;
    }
</style>

