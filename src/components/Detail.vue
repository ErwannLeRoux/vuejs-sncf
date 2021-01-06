<template>
    <div id="main" class="container-fluid pb-4">
        <HeaderWithSelectYear :title="title" :subtitle="subtitle" :current-year="currentYear" :years-list="yearsList" @selectChange="modifyCurrentYear"/>
        <div v-if="yearsList.length != 0" class="container-fluid rounded shadow-sm bg-white my-2" id="main-infos">
            <div class="row">
                <div class="col-sm-9">
                
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
        <ComplianceTracking :years-list="yearsList" :data-years="dataYears" :good-threshold="goodThreshold" :bad-threshold="badThreshold" />
    </div>
</template>

<script>
import { store } from './../storages/stations.js';
import HeaderWithSelectYear from './HeaderWithSelectYear.vue';
import ComplianceTracking from './ComplianceTracking.vue';
import PercentSpinnerChart from './PercentSpinnerChart.vue';
 
export default {
    name: "Detail",
    components: {
        HeaderWithSelectYear,
        ComplianceTracking,
        PercentSpinnerChart
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
    },
    watch: {
        stationInfo(){
            console.log(this.stationInfo)
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
        color:#2c3e50;
    }
</style>
