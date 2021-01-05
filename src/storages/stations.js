import axios from 'axios';
import { createStore } from 'vuex'

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
            return state.departments
        }
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
        disconnect(state){
            state.regions = []
        },
        getRegions (state, payload) {
            axios.get(`http://antoinegonzalez.fr:8081/regions`)
                .then(result => {
                    state.regions = result.data.data
                    this.commit("getDepartments", payload)
                })
                .catch(console.error);
        },
        getDepartments (state, payload) {

            axios.get(`http://antoinegonzalez.fr:8081/departments/?region=${payload}`)
                .then(result => {
                    state.departments = result.data.data
                })
                .catch(console.error);
        },
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

            let queryString = ''
            if(dep != -1) {
                queryString = `?year=${year}&mode=${mode}&num_dep=${dep}`
            } else if(region == 'Toutes les régions') {
                queryString = `?year=${year}&mode=${mode}`
            } else {
                queryString = `?region=${region}&year=${year}&mode=${mode}`
            }

            let url = `http://localhost:8081/stations/${queryString}`

            return new Promise(( resolve, reject ) => {
                axios.get(url)
                    .then(result => {
                        resolve(result.data.data);
                    })
                    .catch((err) => reject(err));
            });
        },
        getRegions (context, payload) {
          let region = 'Normandie'
          if(payload && payload.region_name) region = payload.region_name
          return new Promise(( resolve, reject ) => {
              axios.get(`http://antoinegonzalez.fr:8081/regions/?region=${region}`)
                  .then(result => {
                      resolve(result.data.data[0]);
                  })
                  .catch(() => reject());
          });
        },
        getRegionList (context) {
          return new Promise(( resolve, reject ) => {
              axios.get(`http://antoinegonzalez.fr:8081/regions`)
                  .then(result => {
                      resolve(result.data.data);
                  })
                  .catch(() => reject());
          });
        }
    }
})
