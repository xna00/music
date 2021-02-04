import { createApp } from "vue";
import App from "./App.vue";
import "../registerServiceWorker";
import router from "./router";
import store from "../store";
import BottomSheet from "./components/BottomSheet.vue";

import "../assets/style/index.scss";

createApp(App)
  .use(store)
  .use(router)
  .component("BottomSheet", BottomSheet)
  .mount("#app");
