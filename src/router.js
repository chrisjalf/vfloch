import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("./pages/Home.vue");
const NotFound = () => import("./pages/NotFound.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

export default router;
