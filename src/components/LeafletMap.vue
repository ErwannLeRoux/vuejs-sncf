<template>
    <div id="mapContainer" ></div>
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

        },
        mounted() {
            const L = window.L
            delete L.Icon.Default.prototype._getIconUrl;

            L.Icon.Default.mergeOptions({
                iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
                iconUrl: require('leaflet/dist/images/marker-icon.png'),
                shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
            });

            let markers = L.layerGroup()

            store.dispatch("getStations").then((res) => {
                this.map = L.map('mapContainer').setView([48.62361111, 0.128888889], 8);

                this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '',
                });
                this.tileLayer.addTo(this.map);

                res.forEach(function(station) {


                    let marker = L.marker([station.fields.y_wgs84, station.fields.x_wgs84])
                    markers.addLayer(marker);
                    marker.bindTooltip(station.fields.libelle).openTooltip();
                })
                markers.addTo(this.map)
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
