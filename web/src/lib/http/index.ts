import axios from "axios";
const http = axios.create({
  baseURL: "http://localhost:3000/api",
});

http.interceptors.request.use((config) => {
  if (localStorage.token) {
    config.headers.Authorization = "Bearer " + localStorage.token;
  }
  return config;
});

export default http