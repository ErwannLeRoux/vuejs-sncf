import axios from 'axios';
import { createStore } from 'vuex'

const API_HOST = process.env.VUE_APP_API_HOST
const API_PORT = process.env.VUE_APP_API_PORT

export const store = createStore({
    state() {
        return {
            regions: [],
            departments: [],
            stations: [],
            cleanliness: [],
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
        getDepartments: (state) => {
            return state.departments
        },
        getRegions: (state) => {
            return state.regions
        }
    },
    mutations: {
        getGlobalScores(state) {
            axios.get(`${API_HOST}:${API_PORT}/global_scores`)
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
            if(localStorage.topStations) {
                state.topStations = JSON.parse(localStorage.getItem('topStations'));
            } else {
                axios.get(`${API_HOST}:${API_PORT}/top5?year=${year}`)
                    .then((response) => {
                        localStorage.setItem('topStations', JSON.stringify(response.data.data));
                        state.topStations = response.data.data
                    }).catch((error) => {
                    console.log(error)
                })
            }
        },
        getFlopStations(state,year){
            if(localStorage.flopStations) {
                state.flopStations = JSON.parse(localStorage.getItem('flopStations'));
            } else {
                axios.get(`${API_HOST}:${API_PORT}/worst5?year=${year}`)
                    .then((response) => {
                        localStorage.setItem('flopStations', JSON.stringify(response.data.data));
                        state.flopStations = response.data.data
                    }).catch((error) => {
                    console.log(error)
                })
            }
        },
        getStation(state,uic_code){
            axios.get(`${API_HOST}:${API_PORT}/station/${uic_code}`)
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
            state.regions = []
        },
        getRegions (state, payload) {
            if(localStorage.regions) {
                state.regions = JSON.parse(localStorage.getItem('regions'));
            } else {
                axios.get(`${API_HOST}:${API_PORT}/regions`)
                    .then(result => {
                        localStorage.setItem('regions', JSON.stringify(result.data.data));
                        state.regions = result.data.data
                        this.commit("getDepartments", payload)
                    })
                    .catch(console.error);
            }
        },
        getDepartments (state, payload) {
            let queryString = ''
            if(payload) {
                queryString = `?region=${payload}`
            }
            let url = `${API_HOST}:${API_PORT}/departments/${queryString}`

            axios.get(url)
                .then(result => {
                    state.departments = result.data.data
                })
                .catch(console.error);
        },
        getStations(state, payload) {
            if(localStorage.stations) {
                state.stations = JSON.parse(localStorage.getItem('stations'));
            } else {
                axios.get(`${API_HOST}:${API_PORT}/stations`)
                    .then(result => {
                        localStorage.setItem('stations', JSON.stringify(result.data.data));
                        state.stations = result.data.data
                    })
                    .catch(console.error);
            }
        }
    },
    actions: {
        getStations (context, payload) {
            let region = 'Normandie'
            let year   = '2020'
            let mode   = 'audited-only'
            let dep    = -1

            if(payload) {
                if(payload.region_name) region   = payload.region_name
                if(payload && payload.year) year = payload.year
                if(payload && payload.mode) mode = payload.mode
                if(payload && payload.dep)  dep  = payload.dep
            }

            if(region == 'Toutes les régions' && dep == -1 && mode == 'audited-only' && year == 2020) {
                if (localStorage.defaultMapConfig) {
                    return new Promise((resolve, reject) => {
                        resolve(JSON.parse(localStorage.getItem('defaultMapConfig')))
                    })
                } else {

                    return new Promise(( resolve, reject ) => {
                        axios.get(`${API_HOST}:${API_PORT}/stations/?year=${year}&mode=${mode}`)
                            .then(result => {
                                localStorage.setItem('defaultMapConfig', JSON.stringify(result.data.data))
                                resolve(result.data.data);
                            })
                            .catch((err) => reject(err));
                    });
                }
            } else {
                let queryString = ''
                if(dep != -1) {
                    queryString = `?year=${year}&mode=${mode}&num_dep=${dep}`
                } else if(region == 'Toutes les régions') {
                    queryString = `?year=${year}&mode=${mode}`
                } else {
                    queryString = `?region=${region}&year=${year}&mode=${mode}`
                }

                let url = `${API_HOST}:${API_PORT}/stations/${queryString}`

                return new Promise(( resolve, reject ) => {
                    axios.get(url)
                        .then(result => {
                            resolve(result.data.data);
                        })
                        .catch((err) => reject(err));
                });
            }
        },
        getRegions (context, payload) {
          let region = 'Normandie'
          if(payload && payload.region_name) region = payload.region_name
          return new Promise(( resolve, reject ) => {
              axios.get(`${API_HOST}:${API_PORT}/regions/?region=${region}`)
                  .then(result => {
                      resolve(result.data.data[0]);
                  })
                  .catch(() => reject());
          });
        },
        getRegionList (context) {
          return new Promise(( resolve, reject ) => {
              axios.get(`${API_HOST}:${API_PORT}/regions`)
                  .then(result => {
                      resolve(result.data.data);
                  })
                  .catch(() => reject());
          });
        }
    }
})
