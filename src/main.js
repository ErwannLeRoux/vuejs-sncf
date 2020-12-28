import { createApp } from 'vue'
import { store } from './storages/stations.js'
import App from './App.vue'

createApp(App).use(store).mount('#app')
