import { createRouter, createWebHistory  } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory('/demo/api/questionnaire/'),
  routes,
});

export default router;
