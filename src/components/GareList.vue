<template>
    <h3 class="list-title">Liste des Gares</h3>
    <div id="container" class="rounded shadow-sm bg-light px-2 py-4">
        <div v-if="!onLoad" id="station-list-container">
            <div class="filter-control rounded shadow-sm bg-white">
                <div class="form-group">
                    <label for="search-input">Rechercher : </label>
                    <input id="search-input" v-model="filterText" class="form-control"/>
                </div>
                <div class="form-group">
                    <label for="regionSelect">Région : </label>
                    <select id="regionSelect" class="form-control" v-model="regionSelected" @change="displayConfigChanged()">
                        <option value="Toutes les régions">Toutes les régions</option>
                        <option v-for="option in options" v-bind:key="option.region_name" v-bind:value="option.region_name">
                            {{ option.region_name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="depSelect">Département : </label>
                    <select id="depSelect" class="form-control" v-model="selectedDep" @change="displayConfigChanged()">
                        <option value="-1">Tous les départements</option>
                        <option v-for="option in dpt" v-bind:key="option.num_dep" v-bind:value="option.num_dep">
                            {{ option.dep_name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="yearSelect">Année : </label>
                    <select class="form-control" id="yearSelect" v-model="selectedYear" @change="displayConfigChanged()">
                        <option>2020</option>
                        <option>2019</option>
                        <option>2018</option>
                        <option>2017</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="auditedSelect"> Affichage : </label>
                    <select class="form-control" id="auditedSelect" v-model="stationDisplay" @change="displayConfigChanged()">
                        <option value="audited-only">Audités seulement</option>
                        <option value="non-audited-only">Non audités seulement</option>
                        <option value="all">Toutes les gares</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="sortSelect"> Affichage : </label>
                    <select class="form-control" id="sortSelect" v-model="sortMode" @change="displayConfigChanged()">
                        <option value="desc">Trier par moyenne décroissante</option>
                        <option value="asc">Trier par moyenne croissante</option>
                        <option value="tend-desc">Trier par tendance décroissante</option>
                        <option value="tend-asc">Trier par tendance croissante</option>
                    </select>
                </div>

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
                    <tr v-bind:key="n" v-for="n in perPage" @click="rowClicked(stations[n + offset - 1])">
                        <td>{{ stations[n + offset - 1].uic_code }}</td>
                        <td>{{ stations[n + offset - 1].name }}</td>
                        <td>{{ stations[n + offset - 1].city }}</td>
                        <td>{{ stations[n + offset - 1].department }} ({{ stations[n + offset - 1].dpt_num }})</td>
                        <td>
                            <span v-if="hasAuditsForYear(stations[n + offset - 1])" v-bind:style="{ color : colorForValue(stations[n + offset - 1]) }">
                                {{ averageScore(stations[n + offset - 1 ]) }}%
                            </span>
                            <span v-else>
                                Non auditée
                            </span>
                        </td>
                        <td v-bind:style="{color: colorForEvolution(stations[n + offset - 1]) }">{{ previousYearEvolution(stations[n + offset - 1])[1] }}</td>
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
                page: 1,
                selectedDep: -1,
                stationDisplay: 'audited-only',
                selectedYear: '2020',
                regionSelected: 'Toutes les régions',
                sortMode: 'asc',
                filterText: ''
            };
        },
        computed: {
            stations: function() {
                let s = store.getters.getStations

                if(this.filterText != '') {
                    s = s.filter((station) => {
                        let name_contains = station.name.includes(this.filterText)
                        let dpt_contains = station.department.includes(this.filterText)
                        let region_contains = station.region_name.includes(this.filterText)
                        let city_contains = station.city.includes(this.filterText)
                        let uic_contains =  station.uic_code.includes(this.filterText)
                        return (name_contains || dpt_contains || region_contains || city_contains || uic_contains)
                    })
                }


                if(this.stationDisplay == 'audited-only') {
                    s = s.filter((station) => {
                        let scores = station.scores_for_years.find(score => score.year == this.selectedYear)
                        return scores
                    })
                } else if(this.stationDisplay == 'non-audited-only') {
                    s = s.filter((station) => {
                        let scores = station.scores_for_years.find(score => score.year == this.selectedYear)
                        if(!scores) return true
                        return false
                    })
                }

                if(this.selectedDep != -1) {
                    s = s.filter((station) => {
                        return station.dpt_num == this.selectedDep
                    })
                }

                if(this.regionSelected != 'Toutes les régions') {
                    s = s.filter((station) => {
                        return station.region_name == this.regionSelected
                    })
                }


                if(this.sortMode == 'asc') {
                    s = s.sort((stationA, stationB) => {
                        let scoreA = stationA.scores_for_years.find(score => score.year == this.selectedYear)
                        let scoreB = stationB.scores_for_years.find(score => score.year == this.selectedYear)
                        if(scoreA && scoreB) {
                            return scoreA.average_score - scoreB.average_score
                        }

                        if(scoreA) {
                            return -1
                        }

                        if(scoreB) {
                            return 1
                        }
                    })
                } else if(this.sortMode == 'desc'){
                    s = s.sort((stationA, stationB) => {
                        let scoreA = stationA.scores_for_years.find(score => score.year == this.selectedYear)
                        let scoreB = stationB.scores_for_years.find(score => score.year == this.selectedYear)
                        if(scoreA && scoreB) {
                            return scoreB.average_score - scoreA.average_score
                        }

                        if(scoreA) {
                            return -1
                        }

                        if(scoreB) {
                            return 1
                        }
                    })
                } else if(this.sortMode == 'tend-asc') {
                    s = s.sort((stationA, stationB) => {
                        let a = this.previousYearEvolution(stationA)[0]
                        let b = this.previousYearEvolution(stationB)[0]

                        if(a && b) {
                            return b - a
                        }

                        if(a) {
                            return -1
                        }

                        if(b) {
                            return 1
                        }
                    })
                } else {
                    s = s.sort((stationA, stationB) => {
                        let a = this.previousYearEvolution(stationA)[0]
                        let b = this.previousYearEvolution(stationB)[0]

                        if(a && b) {
                            return a - b
                        }

                        if(a) {
                            return -1
                        }

                        if(b) {
                            return 1
                        }
                    })
                }

                return s
            },
            options: function () {
                return store.getters.getRegions
            },
            dpt: function() {
                return store.getters.getDepartments
            },
            offset: function() {
                return (this.page - 1) * this.default_per_page
            },
            perPage: function() {
                let total_pages = Math.trunc(this.stations.length / this.default_per_page) + 1
                let mod = this.stations.length%this.default_per_page

                if(this.page == total_pages && this.page == 1) {
                    return  this.stations.length
                }
                if(this.page == total_pages) {
                    return mod - 1
                } else {
                    return 10
                }
            }
        },
        methods: {
            displayConfigChanged: function() {
                store.commit("getDepartments", this.regionSelected)
                if(this.regionSelected == 'Toutes les régions') {
                    this.selectedDep = -1
                }
            },
            hasAuditsForYear: function(station) {
                let audits = station.scores_for_years
                let item   = audits.find(item => item.year == this.selectedYear)
                if(item) {
                    return true
                } else {
                    return false
                }
            },
            averageScore: function(station) {
                let audits = station.scores_for_years
                let item   = audits.find(item => item.year == this.selectedYear)
                return item.average_score.toFixed(2)
            },
            colorForValue: function(station) {
                let audits = station.scores_for_years
                let item   = audits.find(item => item.year == this.selectedYear)
                if(item.average_score >= 95) {
                    return 'green'
                }

                if(item.average_score >= 90) {
                    return 'orange'
                }

                return 'red'
            },
            previousYearEvolution: function(station) {
                let year = station.scores_for_years.find(item => item.year == this.selectedYear)
                let previousYear = station.scores_for_years.find(item => item.year == (parseInt(this.selectedYear) - 1))
                let evolutionStr = ' - '
                let delta = 0
                if(year && previousYear) {
                    delta = (year.average_score - previousYear.average_score).toFixed(2)
                    if(delta > 0) {
                        evolutionStr = '+'+delta+'%'
                    } else {
                        evolutionStr = delta+'%'
                    }
                }
                return [delta, evolutionStr]
            },
            colorForEvolution: function(station) {
                let delta = this.previousYearEvolution(station)[0]
                if(delta >= 0) {
                    return 'green'
                }
                return 'red'
            },
            rowClicked: function(station) {
                this.$router.push(`/detail/${station.uic_code}`)
            }
        },
        mounted() {
            store.commit("getStations")
            store.commit("getDepartments")
            store.commit("getRegions", this.regionSelected)
        }
    }
</script>

<style scoped>
    .list-title {
        color:white;
        text-align: left;
        margin-left: 3vw;
        margin-bottom: 3vh;
    }
    .filter-control {
        display: flex;
        width: 100%;
        justify-content: space-around;
    }

    #station-list-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #table-container {
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
</style>
