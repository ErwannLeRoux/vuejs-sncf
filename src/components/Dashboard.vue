<template>
    <main class="container-fluid">
        <div class="row">
            <div class="col-sm">
               <Topfivetab :info="fiveBest" :stations-list="stations" />
            </div>
            <div class="col-sm">
                <Topfivetab :info="fiveWorst" :stations-list="stations" /> 
            </div>
        </div>
        <PercentSpinnerChart :percent-value="95" :good-threshold="95" :bad-threshold="90" :caption="'Taux de conformité global'" />
        <ComplianceTracking :dataYears="globalScores" :currentYear="currentYear"/>
    </main>
    
</template>

<script>
import { store } from './../storages/stations.js';
import Topfivetab from './Topfivetab.vue';
import PercentSpinnerChart from './PercentSpinnerChart'
import ComplianceTracking from './ComplianceTracking'
export default {
    name: "Dashboard",
    components: {
        Topfivetab,
        PercentSpinnerChart,
        ComplianceTracking,     
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
            currentYear : "2020",
        };
    },
    computed:{
        stations(){
            return store.getters.getStations.slice(0,5);
        },
        globalScores(){
            return store.getters.getGlobalScores;
        }
    },
    methods :{

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

