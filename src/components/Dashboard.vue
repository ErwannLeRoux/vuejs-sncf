<template>
    <main class="container">
        <div class="row">
            <div class="col-sm">
               <Topfivetab :info="fiveBest" :stations-list="stations" />
            </div>
            <div class="col-sm">
                <Topfivetab :info="fiveWorst" :stations-list="stations" /> 
            </div>
        </div>
        <PercentSpinnerChart :percent-value="95" :good-threshold="95" :bad-threshold="90" :caption="'Taux de conformité global'" />
        <ComplianceTrackingChart />
    </main>
    
</template>

<script>
import { store } from './../storages/stations.js';
import Topfivetab from './Topfivetab.vue';
import PercentSpinnerChart from './PercentSpinnerChart'
import ComplianceTrackingChart from './ComplianceTrackingChart'
export default {
    name: "Dashboard",
    components: {
        Topfivetab,
        PercentSpinnerChart,
        ComplianceTrackingChart
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
            }
        };
    },
    computed:{
        stations(){
            return store.getters.getStations.slice(0,5);
        }
    },
    methods :{

    },
    mounted: function(){
        store.commit("getStations");
    }
}
</script>

<style scoped>

</style>

