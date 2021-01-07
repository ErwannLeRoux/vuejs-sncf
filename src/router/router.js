import "vue-router";
import Dashboard from "@/components/Dashboard.vue";
import GareList from "@/components/GareList.vue";
import LeafletMap from "@/components/LeafletMap.vue";
import Detail from "@/components/Detail.vue";
import Accueil from "@/components/Accueil.vue";
import { createWebHistory, createRouter} from "vue-router";


const routes = [
  {
    path: "/",
    name: "Accueil",
    component: Accueil,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/map",
    name: "Carte",
    component: LeafletMap,
  },
  {
    path: "/gares",
    name: "Liste des gares",
    component: GareList,
  },
  {
      path: "/detail/:id",
      name: "Detail",
      component: Detail,
  }
];

const router = createRouter({
    history : createWebHistory(),
    routes
});

export default router;
