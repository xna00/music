import Main from "../views/Main.vue";
import Search from "../views/Search.vue";
import Play from "../views/Play.vue";
import Mix from "../views/Mix.vue";
import Login from "../views/Login.vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  { path: "/main", component: Main },
  { path: "/search", component: Search },
  { path: "/play", component: Play },
  { path: "/mix/:id", component: Mix, props: true },
  { path: "/login", component: Login },
  { path: "/:pathMatch(.*)", redirect: "/main" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
