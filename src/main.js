import { createApp } from 'vue'
import { store } from './storages/stations.js'
import App from './App.vue'
import router from './router/router.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App).use(store).use(router).mount('#app')
