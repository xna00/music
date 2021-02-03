import { ref } from "vue";
import http from "./http";

const mixes = ref();
const getMixes = async () => {
  mixes.value = (await http.get("/mixes")).data;
};

const getMix = async (id: string) => {
  return (await http.get(`/mixes/${id}`)).data;
};

const putMix = async (newMix) => {
  console.log(newMix);
  return (await http.put(`/mixes/${newMix._id}`, newMix)).data;
};

const addMusic = async (id: string, music) => {
  const mix = await getMix(id);
  mix.music.push(music);
  await putMix(mix);
};

const likeMusic = async (music) => {
  await addMusic(mixes.value[0]._id, music);
};

const addMix = async (name: string) => {
  await http.post("/mixes", {
    name,
  });
  getMixes();
};

export { mixes, getMixes, getMix, putMix, addMusic, likeMusic, addMix };
