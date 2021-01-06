<template>
    <div id="container" class="rounded shadow-sm bg-light px-2 py-4">
        <div v-if="!onLoad" id="station-list-container">
            <div id="header" class="d-flex justify-content-center flex-wrap mx-2 pt-2">
                <h4 id="title" class="pl-2"><a class="tip title" data-toggle="tooltip" :title="gg">Liste des gares</a></h4>
            </div>
            <div id="table-container" class="table-responsive-sm rounded py-2 px-2">
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
                    <tbody v-if="stations.length">
                    <tr v-bind:key="n" v-for="n in perPage">
                        <td>{{ stations[n + offset].uic_code }}</td>
                        <td>{{ stations[n + offset].name }}</td>
                        <td>{{ stations[n + offset].city }}</td>
                        <td>{{ stations[n + offset].dpt_num }}</td>
                        <td><span v-if="stations[n + offset].scores_for_years.length">Valeurs</span></td>
                        <td>{{ stations[n + offset].name }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <pagination v-if="stations.length" v-model="page" :options="{texts: {count: '{page} sur {pages}'} }" :records="stations.length" :per-page="default_per_page"/>
        </div>
        <div v-else id="loader-container">
            <div class="loader" id="loader-1"></div>
        </div>
    </div>


</template>


<script>
    import {store} from "../storages/stations";
    import Pagination from 'v-pagination-3';

    export default {
        name: "GareList",
        components: {
            Pagination
        },
        data() {
            return {
                default_per_page: 10,
                page: 1
            };
        },
        computed: {
            stations: function() {
                return store.getters.getStations
            },
            offset: function() {
                return (this.page - 1) * this.perPage
            },
            perPage: function() {
                let total_pages = Math.trunc(this.stations.length / this.default_per_page) + 1
                let mod = this.stations.length%this.default_per_page

                if(this.page == total_pages) {
                    return mod - 1
                } else {
                    return 10
                }
            }
        },
        methods: {

        },
        mounted() {
           store.commit("getStations")
        }
    }
</script>

<style scoped>
    #station-list-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #header, #table-container {
        width: 100%;
    }

    #container{
        margin-left: 3vw;
        margin-right: 3vw;
        color:#2c3e50;
    }
    table tbody tr:hover {
        background-color: lightgray;
        cursor: pointer;
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
