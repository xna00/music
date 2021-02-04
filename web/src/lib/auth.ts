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
  }
};

export {login}
