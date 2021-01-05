import axios from 'axios';
import { createStore } from 'vuex'

export const store = createStore({
    state() {
        return {
            stations: [],
            cleanliness: [],
            handicapFacilities: [],
            wifiEquipment: [],
            salesWaitingTime: [],
            waitingServices: [],
            global_scores: [],
            topStations: [],
            flopStations: [],
            station: {},
        }
    },
    getters: {
        getGlobalScores: (state) => {
            return state.global_scores
        },
        getTopStations: (state) => {
            return state.topStations
        },
        getFlopStations: (state) => {
            return state.flopStations
        },
        getStation: (state) => {
            return state.station
        },
        getStations: (state) => {
            return state.stations
        },
        getCleanliness: (state) => {
            return state.cleanliness
        },
        getHandicapFacilities: (state) => {
            return state.handicapFacilities
        },
        getWifiEquipment: (state) => {
            return state.wifiEquipment
        },
        getSalesWaitingTime: (state) => {
            return state.salesWaitingTime
        },
        getWaitingServices: (state) => {
            return state.waitingServices
        },
    },
    mutations: {
        getGlobalScores(state) {
            axios.get("http://192.168.1.16:8081/global_scores")
            .then((response) => {
                response.data.data.forEach((year) => {
                    year.data.sort((a,b) => {
                        return parseInt(a.month) - parseInt(b.month)
                    })
                });
                state.global_scores = response.data.data
            }).catch((error) => {
                console.log(error)
            });
        },
        getTopStations(state,year){
            axios.get(`http://192.168.1.16:8081/top5?year=${year}`)
            .then((response) => {
                state.topStations = response.data.data
            }).catch((error) => {
                console.log(error)
            })
        },
        getFlopStations(state,year){
            axios.get(`http://192.168.1.16:8081/worst5?year=${year}`)
            .then((response) => {
                state.flopStations = response.data.data
            }).catch((error) => {
                console.log(error)
            })
        },
        getStation(state,uic_code){
            axios.get(`http://192.168.1.16:8081/station/${uic_code}`)
            .then((response) => {
                response.data.data[0].scores_for_years.forEach((d) => {
                    d.data.sort((a,b) => {
                        return parseInt(a.month) - parseInt(b.month) 
                    })
                    
                })
                state.station = response.data.data[0]
            }).catch((error) => {
                console.log(error)
            })
        },
        disconnect(state){
            state.stations = []
            state.cleanliness = []
            state.handicapFacilities = []
            state.wifiEquipment = []
            state.salesWaitingTime = []
            state.waitingServices = []
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
        getWifiEquipment(state) {
            axios.get("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=gares-equipees-du-wifi&rows=-1")
                .then((response) => {
                    state.wifiEquipment = response.data.records
                }).catch((error) => {
                console.log(error)
            });
        },
        getSalesWaitingTime(state) {
            axios.get("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=attente-au-guichet&rows=-1")
                .then((response) => {
                    state.salesWaitingTime = response.data.records
                }).catch((error) => {
                console.log(error)
            });
        },
        getWaitingServices(state) {
            axios.get("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=gares-pianos&q=&rows=-1")
                .then((response) => {
                    state.waitingServices = response.data.records
                }).catch((error) => {
                console.log(error)
            });
        },
    },
})
