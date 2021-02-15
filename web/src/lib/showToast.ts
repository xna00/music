import Toast from "../components/Toast.vue";
import { h, createApp } from "vue";
const showToast = (content, time = 1000) => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const app = createApp(
    h(
      Toast,
      { time },
      {
        default: () => content,
      }
    )
  );
  app.mount(div);
  setTimeout(() => {
    app.unmount(div);
    div.remove();
  }, time * 2);
};
export default showToast;
