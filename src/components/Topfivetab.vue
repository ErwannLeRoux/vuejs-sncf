<template>
    <div id="container" class="rounded shadow-sm bg-light px-2 py-4">  
        <div v-if="!onLoad" id="header" class="d-flex justify-content-center flex-wrap mx-2 pt-2">
                <svg id="trend-rect" width="30" height="30" v-bind:fill="info.color">
                    <rect x="0" y="0" rx="5" ry="5" width="30" height="30" style="opacity:0.5"/>
                </svg>
                <h4 id="title" class="pl-2"><a class="tip title" data-toggle="tooltip" :title="info.tip">{{info.title}}</a></h4>
        </div>
        <div v-if="!onLoad" class="table-responsive-sm rounded py-2 px-2">
            <table class="table" id='table'>
                <thead>
                    <tr>
                        <th scope="col">Code_uic</th>
                        <th scope="col">Libellé</th>
                        <th scope="col">Commune</th>
                        <th scope="col">Département</th>
                        <th scope="col"><a class="tip" data-toggle="tooltip" title="Taux de conformité obtenu en %">Score </a></th>
                        <th scope="col"><a class="tip" data-toggle="tooltip" title="Différence avec l'année précédente">Tendance annuelle</a></th>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="station.uic_code" v-for="station in stationsList" @click="redirectDetail(station.uic_code)">
                        <td>{{station.uic_code}}</td>
                        <td>{{station.name }}</td>
                        <td>{{station.city}}</td>
                        <td>{{station.department}} ({{station.dpt_num}})</td>
                        <td>{{scores[station.uic_code].avg_score.toFixed(2)}}%</td>
                        <td class="noTrend" v-if="scores[station.uic_code].trend == '-'">{{scores[station.uic_code].trend}}</td>
                        <td class="goodTrend" v-else-if="scores[station.uic_code].trend >= 0">+{{scores[station.uic_code].trend}}%</td>
                        <td class="badTrend" v-else>{{scores[station.uic_code].trend}}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else id="loader-container">
            <div class="loader" id="loader-1"></div>
        </div>
    </div>
</template>

<script>
import jQuery from "jquery";
const $ = jQuery;
window.$ = $;

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

export default {
    name: "Topfivetab",
    components: {
        
    },
    watch:{
        year(){
            this.onLoad=true
        },
        stationsList(){
            $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            })
            this.onLoad=false
            this.stationsList.forEach(station => {
                let avg_score = station.scores_for_years.find(d => d.year == this.year).average_score
                let avg_score_past_year = null
                let trend = "-"
                if(station.scores_for_years.find(d => d.year == parseInt(this.year)-1)){
                    avg_score_past_year = station.scores_for_years.find(d => d.year == parseInt(this.year)-1).average_score
                    trend = (avg_score - avg_score_past_year).toFixed(2)
                }
                this.scores[station.uic_code] = {
                    avg_score : avg_score,
                    trend : trend
                }
            })
        }
    },
    data() {
        return {
            color : "red",
            scores: [],
            onLoad: true,
        };
    },
    computed:{
    },
    methods :{
        redirectDetail(code_uic){
            this.$router.push({ path: `/detail/${code_uic}` })
        }
    },
    props: ["year","info","stationsList"],
}
</script>

<style scoped>
    #container{
        color:#2c3e50;
    }
    table tbody tr:hover {
        background-color: lightgray;
        cursor: pointer;
    }
    .goodTrend{
        color: green;
    }
    .badTrend{
        color: red;
    }
    .noTrend{
        color:inherit;
    }

    .loader{
        width: 100px;
        height: 100px;
        border-radius: 100%;
        position: relative;
        margin: 0 auto;
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
        padding-left:1em
    }

    .tip{
        text-decoration: underline;
        color: inherit;
        cursor:pointer;
        
    }

    .title{
        text-decoration: none;
    }
</style>