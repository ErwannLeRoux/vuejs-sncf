<template>
    <header>
        <h1 class="title">{{title}}</h1>
    </header>
    <div class="station-navigation rounded shadow-sm bg-white">
        <div v-show="!onLoad" class="filter-control rounded shadow-sm bg-white">
            <p class="error-message" v-if="errorMessage">{{errorMessage}}</p>
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
        </div>
        <div v-show="!onLoad" id="mapContainer" class="rounded shadow-sm bg-white" ></div>
        <div v-if="onLoad" class="loader" id="loader-1"></div>
    </div>
</template>
<script>
    const L = window.L

    import {


    } from "@vue-leaflet/vue-leaflet"
    import "leaflet/dist/leaflet.css"
    import "leaflet/dist/leaflet.js"
    import "leaflet/"

    import {store} from "../storages/stations";

    export default {
        components: {

        },
        data() {
            return {
                selectedDep: -1,
                stationDisplay: 'audited-only',
                selectedYear: '2020',
                regionSelected: 'Toutes les régions',
                markers: [],
                map: null,
                zoom: 5,
                iconWidth: 25,
                iconHeight: 40,
                errorMessage: "",
                onLoad: true,
                oldRegion: 'Toutes les régions'
            };
        },
        computed: {
            options: function () {
                return store.getters.getRegions
            },
            dpt: function() {
                return store.getters.getDepartments
            },
            title: function() {
                return this.regionSelected + " - "+this.selectedYear
            }
        },
        watch: {
            onLoad: function() {
                setTimeout(() =>{ this.map.invalidateSize()}, 200);
            },
        },
        methods: {
            displayConfigChanged: function() {
                this.errorMessage = ""

                if(this.oldRegion != this.regionSelected) {
                    this.selectedDep = '-1'
                }
                this.oldRegion = this.regionSelected

                store.commit("getDepartments", this.regionSelected)
                let params = { region_name: this.regionSelected, year: this.selectedYear, mode: this.stationDisplay, dep: this.selectedDep }


                if((this.stationDisplay == 'non-audited-only' || this.stationDisplay == 'all') && this.regionSelected == 'Toutes les régions') {
                    // toast error not possible
                    this.errorMessage = "Ce mode d'affichage est seulement disponible à l'échelle d'une région"
                } else {
                    this.onLoad = true
                    store.dispatch("getStations", params).then((stations) => {
                        store.dispatch("getRegions", {region_name: this.regionSelected}).then((region) => {
                            let zoom = 6
                            let viewBox = {lat: 47.0457155124968, lng: 2.435565234333265 }
                            if(region) {
                                zoom = 7
                                viewBox.lat = region.lat,
                                    viewBox.lng = region.lng
                            }

                            this.buildMap(stations, viewBox, zoom, false)
                        }).catch(console.error)
                    }).catch(console.error)
                }
            },
            initMapContext: function () {
                delete L.Icon.Default.prototype._getIconUrl;

                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: require('../assets/images/marker-green/marker-icon-2x.png'),
                    iconUrl: require('../assets/images/marker-green/marker-icon.png'),
                    shadowUrl: require('../assets/images/marker-shadow.png'),
                });
            },
            buildMap(stations, viewbox, zoom, init) {
                if(!init) {
                    // cleaning the map
                    this.markers.clearLayers()
                    this.map.remove()
                }
                this.markers = L.layerGroup()
                this.map = L.map('mapContainer').setView([viewbox.lat, viewbox.lng], zoom);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '',
                }).addTo(this.map)

                stations.forEach((station) => {
                    let scores = station.scores_for_years
                    let color = 'unknown'
                    if(scores && scores.length > 0) {
                        let currentYear = scores[0]
                        if(currentYear) {
                            let avg = currentYear.average_score
                            if(avg >= 95) {
                                color = 'green'
                            } else if (avg >= 90)  {
                                color = 'orange'
                            } else {
                                color = 'red'
                            }

                        }
                    }
                    let icon = new L.Icon({
                        iconRetinaUrl: require(`../assets/images/marker-${color}/marker-icon-2x.png`),
                        iconUrl: require(`../assets/images/marker-${color}/marker-icon.png`),
                        shadowUrl: require(`../assets/images/marker-shadow.png`),
                        iconSize: [25, 41], // size of the icon
                        iconAnchor: [0, 30], // point of the icon which will correspond to marker's location
                        popupAnchor: [50, 50] // point from which the popup should open relative to the iconAnchor
                    })

                    if(station.wgs_84[0] && station.wgs_84[1]) {
                        let marker = L.marker([station.wgs_84[0], station.wgs_84[1]], {
                            icon: icon
                        })
                        marker.on('click', () => {
                            this.$router.push(`/detail/${station.uic_code}`)
                        })

                        let libelle = 'Inconnu'
                        if(station.scores_for_years && station.scores_for_years.length != 0) {
                            libelle = station.scores_for_years[0].average_score.toFixed(2)
                        }

                        marker.bindTooltip(`
                            <b>${station.name}</b> (${station.department})</br>
                            Conformité : ${libelle}%
                        `).openTooltip();
                        this.markers.addLayer(marker);
                    }
                })
                this.markers.addTo(this.map)
                this.onLoad = false
            }
        },
        mounted() {
            this.initMapContext()
            store.commit("getRegions", this.regionSelected)
            let params = { region_name: this.regionSelected,  year: this.selectedYear, mode: this.stationDisplay, dep: this.selectedDep }

            store.dispatch("getStations", params).then((stations) => {
              store.dispatch("getRegions", {region_name: this.regionSelected}).then((region) => {
                  let zoom = 6
                  let viewBox = {lat: 47.0457155124968, lng: 2.435565234333265 }
                  if(region) {
                      zoom = 7
                      viewBox.lat = region.lat,
                          viewBox.lng = region.lng
                  }
                  this.buildMap(stations, viewBox, zoom, true)
              })
            })
        }
    };
</script>

<style scoped>
    .error-message {
        color: red;
    }

    .title {
        text-align: left;
        color: white;
    }

    header{
        margin: 2em 3vw 4em;
    }

    #mapContainer {
        width: 800px;
        height: 600px;
    }

    .station-navigation {
        padding: 2vw;
        align-items: center;
        background-color: white;
        display: flex;
        justify-content: space-around;
        box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);
        margin: 3vh 3vw 30px;
    }

    .filter-control {
        height: 600px;
        width: 40vw;
        margin: 0 2em 2em 2em;
        display: flex;
        flex-direction: column;
        border: 10px solid;
        border-image-source: linear-gradient( #771F6B, #E21F25);
        border-image-slice: 1;
        padding: 2em;
        border-radius: 10px;
        box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);
    }

    @media (min-width: 0px) and (max-width: 979px) {
        .station-navigation {
            flex-direction: column;
        }

        #mapContainer {
            width: 100%;
            height: 400px;
        }

        .filter-control {
            width: 100%;
            height: auto;
        }

        .title {
            text-align: center;
        }
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
</style>
