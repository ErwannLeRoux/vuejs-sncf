<template>
    <div id="mapContainer" ></div>
    <select v-model="regionSelected" @change="regionChanged()">
      <option v-for="option in options" v-bind:key="option" v-bind:value="option">
        {{ option }}
      </option>
    </select>
</template>
<script>
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
                options: [],
                markers: [],
                map: null,
                zoom: 5,
                iconWidth: 25,
                iconHeight: 40,
            };
        },
        computed: {
            gares: function() {
                return store.getters.getStations
            }
        },
        methods: {
            regionChanged: function() {

              const L = window.L

              store.dispatch("getStations", {region_name: this.regionSelected}).then((res) => {
                store.dispatch("getRegions", {region_name: this.regionSelected}).then((region) => {
                  this.markers.removeFrom(this.map)
                  this.markers = L.layerGroup()
                  this.map.setView([region.lat, region.lng], 7);

                  this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      attribution: '',
                  });
                  this.tileLayer.addTo(this.map);

                  res.forEach((station) => {
                      let marker = L.marker([station.wgs_84[0], station.wgs_84[1]])
                      marker.bindTooltip(station.name).openTooltip();
                      this.markers.addLayer(marker);
                  })
                  this.markers.addTo(this.map)
                }).catch(console.error)
            }).catch(console.error)
            }
        },
        mounted() {
            store.dispatch("getRegionList").then((response) => {
              response.forEach((region) => {
                this.options.push(region.region_name)
              })
            })

            const L = window.L
            delete L.Icon.Default.prototype._getIconUrl;

            L.Icon.Default.mergeOptions({
                iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
                iconUrl: require('leaflet/dist/images/marker-icon.png'),
                shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
            });

            this.markers = L.layerGroup()

            store.dispatch("getStations", {region_name: this.regionSelected}).then((res) => {
              store.dispatch("getRegions", {region_name: this.regionSelected}).then((region) => {

                this.map = L.map('mapContainer').setView([region.lat, region.lng], 7);

                this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '',
                });
                this.tileLayer.addTo(this.map);

                res.forEach((station) => {
                    let marker = L.marker([station.wgs_84[0], station.wgs_84[1]])
                    marker.bindTooltip(station.name).openTooltip();
                    this.markers.addLayer(marker);
                })
                this.markers.addTo(this.map)
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
