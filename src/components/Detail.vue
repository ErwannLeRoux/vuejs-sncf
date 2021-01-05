<template>
    <div id="main" class="container-fluid pb-4">
        <HeaderWithSelectYear :text="title" :currentYear="currentYear" :yearsList="yearsList" @selectChange="modifyCurrentYear"/>
        {{yearInfo}}
    </div>


</template>

<script>
import { store } from './../storages/stations.js';
import HeaderWithSelectYear from './HeaderWithSelectYear.vue';

export default {
    name: "Detail",
    components: {
        HeaderWithSelectYear
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
            this.yearsList = this.computeYearList()
        },
        currentYear(){
            this.yearInfo = this.stationInfo.scores_for_years.find(d=>d.year == this.currentYear)
        }
    },
    data() {
        return {
            title : "",
            currentYear : null,
            yearsList: null,
            yearInfo: null,
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
        console.log(this.stationInfo)
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
