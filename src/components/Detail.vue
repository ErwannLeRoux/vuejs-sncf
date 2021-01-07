<template>
    <div id="main" class="container-fluid pb-4">
        <HeaderWithSelectYear :title="title" :subtitle="subtitle" :current-year="currentYear" :years-list="yearsList" @selectChange="modifyCurrentYear"/>
        <h3 class="title">Information sur les audits réalisés</h3>
        <div v-if="yearsList.length != 0" class="container-fluid rounded shadow-sm bg-white my-2" id="main-infos">
            <div class="row">
                <div class="col-sm-9">
                    <NumericStatBand :stats="numericStats" :year="currentYear"/>
                </div>
                <div class="col-sm">
                    <div id="spinner">
                        <PercentSpinnerChart :percent-value="averageScore" :good-threshold="goodThreshold" :bad-threshold="badThreshold" :caption="'Taux de conformité moyen'" /> 
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="container-fluid rounded shadow-sm bg-white my-2 py-4" id="main-infos">
            <h1>La gare de {{stationInfo.name}} n'a pas encore été auditée.</h1>
        </div>
        <h3 class="title">Suivi annuel du taux de conformité</h3>
        <ComplianceTracking :years-list="yearsList" :data-years="dataYears" :good-threshold="goodThreshold" :bad-threshold="badThreshold" />
    </div>
</template>

<script>
import { store } from './../storages/stations.js';
import HeaderWithSelectYear from './HeaderWithSelectYear.vue';
import ComplianceTracking from './ComplianceTracking.vue';
import PercentSpinnerChart from './PercentSpinnerChart.vue';
import NumericStatBand from './NumericStatBand.vue'
 
export default {
    name: "Detail",
    components: {
        HeaderWithSelectYear,
        ComplianceTracking,
        PercentSpinnerChart,
        NumericStatBand
    },
    props: [
        "query"
    ],
    computed:{
        stationInfo(){
            return store.getters.getStation;
        },
        maxYear(){
            let years = []
            this.stationInfo.scores_for_years.forEach((y) => {
                years.push(y.year)
            })
            return Math.max(...years)
        },
        numericStats(){
            let res = []
            this.stationInfo.scores_for_years.forEach((d) => {
                let stats = 
                {
                    year : d.year,
                    stats:[
                        { 
                            label:"Nombre d'audits",
                            value: d.data.length,
                            tip: null,
                            color: null
                        },
                        {
                            label:"Nombre d'audits au taux de conformité moyen excellent",
                            value:d.data.filter(d => d.value >= 95).length,
                            tip: "Taux supérieur égal à 95%",
                            color: "green"
                        },
                        {
                            label:"Nombre d'audits au taux de conformité moyen passable",
                            value:d.data.filter(d => (d.value < 95) && (d.value >= 90)).length,
                            tip: "Taux compris entre 90 et 95%",
                            color: "orange" 
                        },
                        {
                            label:"Nombre d'audits au taux de conformité moyen médiocre",
                            value:d.data.filter(d => d.value < 90).length,
                            tip: "Taux inférieur à 90%",
                            color: "red"
                        },
                    ]
                }
                res.push(stats)
            })
            return res
        }
    },
    watch: {
        stationInfo(){
            this.title = `Détail - Gare de ${this.stationInfo.name}`
            this.subtitle = `${this.stationInfo.department} (${this.stationInfo.dpt_num})`
            if(this.stationInfo.scores_for_years.length != 0){
                this.currentYear = this.maxYear
                this.dataYears = this.stationInfo.scores_for_years
            }
        },
        currentYear(){
            if(this.stationInfo.scores_for_years.length != 0){
                this.yearsList = this.computeYearList()
                this.yearInfo = this.stationInfo.scores_for_years.find(d=>d.year == this.currentYear)
                this.averageScore = this.yearInfo.average_score
            }
        }
    },
    data() {
        return {
            title : "",
            subtitle : "", 
            currentYear : null,
            yearsList: [],
            yearInfo: null,
            dataYears: null,
            averageScore: 0,
            goodThreshold: "95",
            badThreshold: "90",
            auditsData: [],
        };
    },
    methods : {
        computeYearList(){
            let res = []
            this.stationInfo.scores_for_years.forEach((y) => {
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
        modifyCurrentYear(selectedYear){
            this.currentYear = selectedYear
        },
    },
    mounted: function(){
        store.commit("getStation",this.$route.params.id );
    }
}
</script>

<style scoped>
    #main {
        width:85%;
        margin:auto;
        padding:0;
    }

    .title{
        text-align: left;
        margin:1em 0em 0.5em 0em;
        padding:0;
    }

    .title a{
        color: white;
        text-decoration: none;
    }

    .title a:hover{
        cursor:pointer;
    }

</style>
