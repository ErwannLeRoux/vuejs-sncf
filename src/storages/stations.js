import axios from 'axios';
import { createStore } from 'vuex'

export const store = createStore({
    state() {
        return {
            stations: [],
            cleanliness: [],
            handicapFacilities: []
        }
    },
    getters: {
        getStations: (state) => {
            return state.stations
        },
        getCleanliness: (state) => {
            return state.cleanliness
        },
        getHandicapFacilities: (state) => {
            return state.handicapFacilities
        },
    },
    mutations: {
        disconnect(state){
            state.stations = []
            state.cleanliness = []
            state.handicapFacilities = []
        },
        getStations(state) {
            axios.get("https://data.sncf.com/api/records/1.0/search/?dataset=liste-des-gares&q=&rows=-1")
            .then((response) => {
                state.stations = response.data.records
            }).catch((error) => {
                console.log(error)
            });
        },
        getCleanliness(state) {
            axios.get("https://data.sncf.com/api/records/1.0/search/?dataset=proprete-en-gare&q=&rows=-1")
                .then((response) => {
                    state.cleanliness = response.data.records
                }).catch((error) => {
                console.log(error)
            });
        },
        getHandicapFacilities(state) {
            axios.get("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=accompagnement-pmr-gares&rows=-1")
                .then((response) => {
                    state.handicapFacilities = response.data.records
                }).catch((error) => {
                console.log(error)
            });
        },
    },
})
