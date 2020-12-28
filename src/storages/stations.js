import axios from 'axios';
import { createStore } from 'vuex'

export const stationsStore = createStore({
    state() {
        return {
            stations: []
        }
    },
    getters: {
        getStations: (state) => {
            return state.stations;
        },
    },
    mutations: {
        disconnect(state){
            state.stations = [];
        },

        getStations(state) {
            axios.get("https://data.sncf.com/api/records/1.0/search/?dataset=liste-des-gares&q=&rows=-1")
            .then((response) => {
                state.stations = response.data.records;
            }).catch((error) => {
                console.log(error)
            });
        },
    },
})
