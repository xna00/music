import axios from "axios";
import router from "../../mobile/router";
const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "/api",
});

http.interceptors.request.use((config) => {
  if (localStorage.token) {
    config.headers.Authorization = "Bearer " + localStorage.token;
  }
  return config;
});
http.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status === 401) {
      router.push("/login");
      return;
    }
    return Promise.reject(err);
  }
);
export default http;
