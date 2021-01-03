import axios from 'axios';
import { createStore } from 'vuex'

export const store = createStore({
    state() {
        return {
            regions: [],
        }
    },
    getters: {
        getRegions: (state) => {
            return state.regions
        }
    },
    mutations: {
        disconnect(state){
            state.regions = []
        },
        getRegions (state) {
            axios.get(`http://antoinegonzalez.fr:8080/regions`)
                .then(result => {
                    state.regions = result.data.data
                })
                .catch(console.error);
        },
    },
    actions: {
        getStations (context, payload) {
            let region = 'Normandie'
            if(payload && payload.region_name) region = payload.region_name
            return new Promise(( resolve, reject ) => {
                axios.get(`http://antoinegonzalez.fr:8080/stations/?region=${region}`)
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
              axios.get(`http://antoinegonzalez.fr:8080/regions/?region=${region}`)
                  .then(result => {
                      resolve(result.data.data[0]);
                  })
                  .catch(() => reject());
          });
        },
        getRegionList (context) {
          return new Promise(( resolve, reject ) => {
              axios.get(`http://antoinegonzalez.fr:8080/regions`)
                  .then(result => {
                      resolve(result.data.data);
                  })
                  .catch(() => reject());
          });
        }

    }
})
