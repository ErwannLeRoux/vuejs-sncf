<template>
    <div id="main" class="container-fluid pb-4">
        <HeaderWithSelectYear :text="title" :current-year="currentYear" :years-list="yearsList" @selectChange="modifyCurrentYear"/>
        <ComplianceTracking  :years-list="yearsList" :data-years="dataYears" :good-threshold="95" :bad-threshold="90" />
    </div>


</template>

<script>
import { store } from './../storages/stations.js';
import HeaderWithSelectYear from './HeaderWithSelectYear.vue';
import ComplianceTracking from './ComplianceTracking.vue';
 
export default {
    name: "Detail",
    components: {
        HeaderWithSelectYear,
        ComplianceTracking
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
            this.title = `Détail - Gare de ${this.stationInfo.name}`
            this.currentYear = this.maxYear
            this.dataYears = this.stationInfo.scores_for_years
        },
        currentYear(){
            this.yearsList = this.computeYearList()
            this.yearInfo = this.stationInfo.scores_for_years.find(d=>d.year == this.currentYear)
        }
    },
    data() {
        return {
            title : "",
            currentYear : null,
            yearsList: null,
            yearInfo: null,
            dataYears: null,
        };
    },
    methods :{
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
</style>
