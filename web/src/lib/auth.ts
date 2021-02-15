import router from "@/mobile/router";
import http from "./http";

const login = async (username, password) => {
  const data = (
    await http.post("/auth/login", {
      username,
      password,
    })
  ).data;
  if (data.token) {
    localStorage.token = data.token;
    router.push("/main");
  }
};

const register = async (username, password) => {
  return (
    await http.post("/auth/register", {
      username,
      password,
    })
  ).data;
};

const getUser = async () => {
  return (await http.get("/auth/user")).data;
};

export { login, register, getUser };
