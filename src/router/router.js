import "vue-router";
import Dashboard from "@/components/Dashboard.vue";
import Gares from "@/components/Gares.vue";
import Detail from "@/components/Detail.vue";
import { createWebHistory, createRouter} from "vue-router";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/gares",
    name: "Gares",
    component: Gares,
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
