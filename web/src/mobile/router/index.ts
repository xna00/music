import Main from "../views/Main.vue";
import Search from "../views/Search.vue";
import Play from "../views/Play.vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  { path: "/main", component: Main },
  { path: "/search", component: Search },
  { path: "/play", component: Play },
  { path: "/:pathMatch(.*)", redirect: "/main" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
