<template>
    <div v-if="dataLoad" id="main" class="container-fluid pb-4">
        <HeaderWithSelectYear :title="title" :current-year="currentYear" :years-list="yearsList" @selectChange="modifyCurrentYear" />
        <h3 class="title">État général de la SNCF</h3>
        <div class="container-fluid rounded shadow-sm bg-white" id="main-infos">
            <div class="container-fluid">
                <NumericStatBand :avg-score="averageScore" :good-threshold="goodThreshold" :bad-threshold="badThreshold" :stats="NumericStat" :year="currentYear"/>
            </div>
        </div>
        <DashboardStationsTop :year="currentYear" />
        <h3 class="title">Suivi annuel du taux de conformité</h3>
        <ComplianceTracking :dataYears="globalScores" :years-list="yearsList" :good-threshold="goodThreshold" :bad-threshold="badThreshold" />
    </div>
    <div v-else id="loader-container" class="d-flex bg-white rounded shadow-sm align-items-center">
        <div class="loader" id="loader-1"></div>
    </div>
</template>

<script>
import { store } from './../storages/stations.js';
import NumericStatBand from './NumericStatBand.vue'
import ComplianceTracking from './ComplianceTracking.vue'
import HeaderWithSelectYear from './HeaderWithSelectYear.vue'
import DashboardStationsTop from './DashboardStationsTop.vue'
export default {
    name: "Dashboard",
    components: {
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
            dataLoad : false
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
                this.dataLoad = true
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
                            label:"Nombre de gares au taux de conformité moyen mauvais",
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
        store.commit("getGlobalScores");
    }
}
</script>

<style scoped>
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


    #main,#loader-container {
        width:95%;
        margin: auto;
        padding:0;
        color:white;
    }
    #main-infos{
        color:#2c3e50
    }
    #stat-title{
        padding: 0.5em 0em;
    }

    #spinner{
        width:200px
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

