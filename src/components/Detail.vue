<template>
    <div v-if="dataload" id="main" class="container-fluid pb-4">
        <HeaderWithSelectYear :title="title" :subtitle="subtitle" :current-year="currentYear" :years-list="yearsList" @selectChange="modifyCurrentYear"/>
        <h3 v-if="yearsList.length != 0" class="title">Information sur les audits réalisés</h3>
        <div v-if="yearsList.length != 0" class="container-fluid rounded shadow-sm bg-white my-2" id="main-infos">
            <div class="container-fluid rounded shadow-sm bg-white" id="main-infos">
                <div class="container-fluid">
                    <NumericStatBand :avg-score="averageScore" :good-threshold="goodThreshold" :bad-threshold="badThreshold" :stats="numericStats" :year="currentYear"/>
                </div>
            </div>
        </div>
      
        <div v-else class="container-fluid rounded shadow-sm bg-white my-2 py-4" id="main-infos">
            <h1>La gare de {{stationInfo.name}} n'a pas encore été auditée.</h1>
        </div>
        <h3 v-if="yearsList.length != 0" class="title">Suivi annuel du taux de conformité</h3>
        <ComplianceTracking :years-list="yearsList" :data-years="dataYears" :good-threshold="goodThreshold" :bad-threshold="badThreshold" />
    </div>
    <div v-else id="loader-container" class="d-flex bg-white rounded shadow-sm align-items-center">
        <div class="loader" id="loader-1"></div>
    </div>
</template>

<script>
import { store } from './../storages/stations.js';
import HeaderWithSelectYear from './HeaderWithSelectYear.vue';
import ComplianceTracking from './ComplianceTracking.vue';
import NumericStatBand from './NumericStatBand.vue'

export default {
    name: "Detail",
    components: {
        HeaderWithSelectYear,
        ComplianceTracking,
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
                            label:"Nombre d'audits excellent",
                            value:d.data.filter(d => d.value >= 95).length,
                            tip: "Taux de conformité moyen supérieur égal à 95%",
                            color: "green"
                        },
                        {
                            label:"Nombre d'audits passable",
                            value:d.data.filter(d => (d.value < 95) && (d.value >= 90)).length,
                            tip: "Taux de conformité moyen compris entre 90 et 95%",
                            color: "orange"
                        },
                        {
                            label:"Nombre d'audits mauvais",
                            value:d.data.filter(d => d.value < 90).length,
                            tip: "Taux de conformité moyen inférieur à 90%",
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
            console.log(this.stationInfo)
            this.dataload = true
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
            dataload:false
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
    #main,#loader-container  {
        width:85%;
        margin:auto;
        padding:0;
    }

    .title{
        text-align: left;
        margin:1em 0em 0.5em 0em;
        padding:0;
        color: white;
    }

    .title a{
        color: white;
        text-decoration: none;
    }

    .title a:hover{
        cursor:pointer;
    }

    .loader{
        width: 100px;
        height: 100px;
        border-radius: 100%;
        position: relative;
        margin: 0 auto;
        vertical-align: middle;
    }

    #loader-1:before, #loader-1:after{
        content: "";
        position: absolute;
        top: -10px;
        left: -10px;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        border: 10px solid transparent;
        border-top-color: #822171;
    }

    #loader-1:before{
        z-index: 100;
        animation: spin 1s infinite;
    }

    #loader-1:after{
        border: 10px solid #ccc;
    }

    @keyframes spin{
        0%{
            -webkit-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        100%{
            -webkit-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    #loader-container{
        margin-top:1em;
        padding-left:1em;
        min-height: 200px;
    }

    @media screen and (max-width: 1000px) {
        .title{
            text-align: center;
        }
    }


</style>
