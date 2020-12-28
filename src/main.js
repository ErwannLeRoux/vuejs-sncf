import { createApp } from 'vue'
import { stationsStore } from './storages/stations.js'
import App from './App.vue'

createApp(App).use(stationsStore).mount('#app')
