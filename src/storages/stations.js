import axios from 'axios';
import { createStore } from 'vuex'

export const store = createStore({
    state() {
        return {
            regions: [],
            departments: [],
            stations: []
        }
    },
    getters: {
        getRegions: (state) => {
            return state.regions
        },
        getDepartments: (state) => {
            return state.departments
        },
        getStations: (state) => {
            return state.stations
        },
    },
    mutations: {
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
            let queryString = ''
            if(payload) {
                queryString = `?region=${payload}`
            }
            let url = `http://antoinegonzalez.fr:8081/departments/${queryString}`

            axios.get(url)
                .then(result => {
                    state.departments = result.data.data
                })
                .catch(console.error);
        },
        getStations(state, payload) {

            axios.get("http://localhost:8081/stations")
                .then(result => {
                    state.stations = result.data.data
                })
                .catch(console.error);

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
