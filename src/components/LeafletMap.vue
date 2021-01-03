<template>
    <div id="mapContainer" ></div>
    <select v-model="regionSelected" @change="regionChanged()">
      <option v-for="option in options" v-bind:key="option.region_name" v-bind:value="option.region_name">
        {{ option.region_name }}
      </option>
    </select>
</template>
<script>
    const L = window.L
    import {


    } from "@vue-leaflet/vue-leaflet";
    import "leaflet/dist/leaflet.css";
    import "leaflet/dist/leaflet.js";
    import "leaflet/"

    import {store} from "../storages/stations";

    export default {
        components: {

        },
        data() {
            return {
                regionSelected: 'Normandie',
                markers: [],
                map: null,
                zoom: 5,
                iconWidth: 25,
                iconHeight: 40,
            };
        },
        computed: {
            options: function () {
                return store.getters.getRegions
            },
        },
        methods: {
            regionChanged: function() {
                store.dispatch("getStations", {region_name: this.regionSelected}).then((stations) => {
                    store.dispatch("getRegions", {region_name: this.regionSelected}).then((region) => {
                        let viewBox = { lat: region.lat, lng: region.lng }
                        this.buildMap(stations, viewBox, 7, false)
                    }).catch(console.error)
                }).catch(console.error)
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
                this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '',
                }).addTo(this.map)

                stations.forEach((station) => {
                    let scores = station.scores_for_years
                    let color = 'unknown'
                    if(scores.length > 0) {
                        let currentYear = scores.find(y => y.year == '2020')
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
                        iconAnchor: [0, 21], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
                    })

                    if(station.wgs_84[0] && station.wgs_84[1] && station.scores_for_years.length != 0) {
                        let marker = L.marker([station.wgs_84[0], station.wgs_84[1]], {
                            icon: icon
                        })

                        marker.bindTooltip(station.name).openTooltip();
                        this.markers.addLayer(marker);
                    }
                })
                this.markers.addTo(this.map)
            }
        },
        mounted() {
            this.initMapContext()
            store.commit("getRegions")
            store.dispatch("getStations", {region_name: this.regionSelected}).then((stations) => {
              store.dispatch("getRegions", {region_name: this.regionSelected}).then((region) => {
                  let viewBox = { lat: region.lat, lng: region.lng }
                  this.buildMap(stations, viewBox, 7, true)
              })
            })
        }
    };
</script>

<style scoped>
    #mapContainer {
        width: 500px;
        height: 500px;
        margin: 0 auto;
    }
</style>
