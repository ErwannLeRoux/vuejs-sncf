<template>
    <div>
        <h3 class="title">
            <a class="tip title" data-toggle="tooltip" title="Gares auditées ayant obtenues les meilleurs taux de conformités">
                Top 5 de nos gares les plus conformes
            </a>
        </h3>
        <Topfivetab :year="year" :stations-list="topStations" />
        <h3 class="title">
            <a class="tip title" data-toggle="tooltip" title="Gares auditées ayant obtenues les moins bons taux de conformités">
                Top 5 de nos gares les moins conformes
            </a>
        </h3>
        <Topfivetab :year="year" :stations-list="flopStations" /> 
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


</style>