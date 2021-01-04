<template>
    <div id="container-fluid" class="my-2">
        <div class="row">
            <div class="col-sm my-2">
                <Topfivetab :year="year" :info="fiveBest" :stations-list="topStations" />
            </div>
            <div class="col-sm my-2 col-sm-offset-2">
                <Topfivetab :year="year" :info="fiveWorst" :stations-list="flopStations" /> 
            </div>
        </div>
    </div>
</template>

<script>
import { store } from './../storages/stations.js';
import Topfivetab from './Topfivetab.vue';
export default {
    name: "DashboardStationsTop",
    components: {
        Topfivetab
    },
    props: ["year"],
    watch:{
        year (){
            store.commit("getTopStations",this.year);
            store.commit("getFlopStations",this.year);
        }
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
        };
    },
    computed:{
        topStations(){
            return store.getters.getTopStations;
        },
        flopStations(){
            return store.getters.getFlopStations;
        }
    },
    mounted: function(){
        store.commit("getGlobalScores");
    }
}
</script>

<style scoped>
    #container{
        color : #2c3e50;
    }
</style>