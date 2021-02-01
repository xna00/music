import { createApp } from "vue";
import App from "./mobile/App.vue";
import "./registerServiceWorker";
import router from "./mobile/router";
import store from "./store";

import "./assets/style/index.scss";

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
