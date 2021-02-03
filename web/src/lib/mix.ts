import { ref } from "vue";
import http from "./http";

const mixes = ref();
const getMixes = async () => {
  mixes.value = (await http.get("/mixes")).data;
};

const getMix = async (id: string) => {
  return (await http.get(`/mixes/${id}`)).data;
};

export { mixes, getMixes, getMix };
