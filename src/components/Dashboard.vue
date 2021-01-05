<template>
    <div id="main" class="container-fluid pb-4">
        <HeaderWithSelectYear :text="title" :currentYear="currentYear" :yearsList="yearsList" @selectChange="modifyCurrentYear" />
        <div class="container-fluid rounded shadow-sm bg-white my-2" id="main-infos">
            <div class="row">
                <div class="col-sm-9">
                    <h3 id="stat-title">État global sur la propreté des gares de la SNCF</h3>
                    <NumericStatBand :stats="NumericStat" :year="currentYear"/>
                </div>
                <div class="col-sm">
                    <div id="spinner">
                        <PercentSpinnerChart :percent-value="averageScore" :good-threshold="goodThreshold" :bad-threshold="badThreshold" :caption="'Taux de conformité moyen'" /> 
                    </div>
                </div>
            </div>
            
        </div>
        <DashboardStationsTop :year="currentYear" />
        <div class="container-fluid mt-5 p-0">
            <h4 id="chart-title">Suivi du taux de conformité moyen de la SNCF à l'année</h4>
            <ComplianceTracking :dataYears="globalScores" :years-list="yearsList" />
        </div>
    </div>
</template>

<script>
import { store } from './../storages/stations.js';
import PercentSpinnerChart from './PercentSpinnerChart.vue'
import NumericStatBand from './NumericStatBand.vue'
import ComplianceTracking from './ComplianceTracking.vue'
import HeaderWithSelectYear from './HeaderWithSelectYear.vue'
import DashboardStationsTop from './DashboardStationsTop.vue'
export default {
    name: "Dashboard",
    components: {
        PercentSpinnerChart,
        ComplianceTracking,
        HeaderWithSelectYear,
        DashboardStationsTop,
        NumericStatBand
    },
    data() {
        return {
            title : "Dashboard Année",
            goodThreshold: "95",
            badThreshold: "90",
            currentYear : null,
            yearScore : null,
            NumericStat : null,
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
                this.fillNumericStat(this.globalScores)
            }
        },
        currentYear(){
            this.yearScore = this.globalScores.find(d => d.year == this.currentYear)
        }
    },
    methods :{
        modifyCurrentYear(selectedYear){
            this.currentYear = selectedYear
        },
        fillNumericStat(data){
            this.NumericStat = []
            data.forEach((d) => {
                let stats = 
                {
                    year : d.year,
                    stats:[
                        { 
                            label:"Nombre de gares auditées",
                            value: d.audit_high+d.audit_low+d.audit_medium,
                            tip: null,
                            color: null
                        },
                        {
                            label:"Nombre de gares au taux de conformité moyen excellent",
                            value:d.audit_high,
                            tip: "Taux supérieur égal à 95%",
                            color: "green"
                        },
                        {
                            label:"Nombre de gares au taux de conformité moyen passable",
                            value:d.audit_medium,
                            tip: "Taux compris entre 90 et 95%",
                            color: "orange" 
                        },
                        {
                            label:"Nombre de gares au taux de conformité moyen médiocre",
                            value:d.audit_low,
                            tip: "Taux inférieur à 90%",
                            color: "red"
                        },
                    ]
                }
                this.NumericStat.push(stats)
            })
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
    #main-infos{
        color:#2c3e50
    }
    #stat-title{
        padding: 0.5em 0em;
    }
</style>

