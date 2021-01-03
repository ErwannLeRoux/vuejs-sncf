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
        <ComplianceTracking :dataYears="years" :currentYear="currentYear"/>
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
            years : [
                {
                    _id: 123,
                    year: "2020",
                    audit_number: 128,
                    data: [
                        {
                            month: "1",
                            value: 80.5,
                        }
                        ,{
                            month: "2",
                            value: 95.5,
                        }
                        ,{
                            month: "3",
                            value: 95.5,
                        }
                        ,{
                            month: "4",
                            value: 95.5,
                        }
                        ,{
                            month: "5",
                            value: 95.5,
                        }
                        ,{
                            month: "6",
                            value: 95.5,
                        }
                        ,{
                            month: "7",
                            value: 95.5,
                        }
                        ,{
                            month: "8",
                            value: 95.5,
                        }
                        ,{
                            month: "9",
                            value: 95.5,
                        }
                        ,{
                            month: "10",
                            value: 95.5,
                        }
                        ,{
                            month: "11",
                            value: 95.5,
                        }
                        ,{
                            month: "12",
                            value: 95.5,
                        }
                    ],
                    average_score: 95.5
                },
                {
                    _id: 456,
                    year: "2019",
                    audit_number: 200,
                    data: [
                        {
                            month: "1",
                            value: 96.5,
                        }
                        ,{
                            month: "2",
                            value: 96.5,
                        }
                        ,{
                            month: "3",
                            value: 96.5,
                        }
                        ,{
                            month: "4",
                            value: 96.5,
                        }
                        ,{
                            month: "5",
                            value: 96.5,
                        }
                        ,{
                            month: "6",
                            value: 96.5,
                        }
                        ,{
                            month: "7",
                            value: 96.5,
                        }
                        ,{
                            month: "8",
                            value: 96.5,
                        }
                        ,{
                            month: "9",
                            value: 96.5,
                        }
                        ,{
                            month: "10",
                            value: 96.5,
                        }
                        ,{
                            month: "11",
                            value: 96.5,
                        }
                        ,{
                            month: "12",
                            value: 96.5,
                        }
                    ],
                    average_score: 96.5
                },
                {
                    _id: 678,
                    year: "2018",
                    audit_number: 75,
                    data: [
                        {
                            month: "1",
                            value: 90.5,
                        }
                        ,{
                            month: "2",
                            value: 90.5,
                        }
                        ,{
                            month: "3",
                            value: 90.5,
                        }
                        ,{
                            month: "4",
                            value: 90.5,
                        }
                        ,{
                            month: "5",
                            value: 90.5,
                        }
                        ,{
                            month: "6",
                            value: 90.5,
                        }
                        ,{
                            month: "7",
                            value: 90.5,
                        }
                        ,{
                            month: "8",
                            value: 90.5,
                        }
                        ,{
                            month: "9",
                            value: 90.5,
                        }
                        ,{
                            month: "10",
                            value: 90.5,
                        }
                        ,{
                            month: "11",
                            value: 90.5,
                        }
                        ,{
                            month: "12",
                            value: 90.5,
                        }
                    ],
                    average_score: 90.5
                },
            ],
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

