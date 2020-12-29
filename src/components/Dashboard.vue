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
        <ScoreOverviewChart />
    </main>
    
</template>

<script>
import { store } from './../storages/stations.js';
import Topfivetab from './Topfivetab.vue';
import ScoreOverviewChart from './ScoreOverviewChart.vue';
export default {
    name: "Dashboard",
    components: {
        Topfivetab,
        ScoreOverviewChart
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

