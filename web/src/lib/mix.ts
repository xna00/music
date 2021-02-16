import { ref, watch } from "vue";
import http from "./http";
import { currentMusic, index } from "./audio";
import showToast from "./showToast";

const mixes = ref();
const getMixes = async () => {
  mixes.value = (await http.get("/mixes")).data;
};

const getMix = async (id: string) => {
  return (await http.get(`/mixes/${id}`)).data;
};

(async () => {
  getMixes();
})();

const putMix = async (newMix) => {
  console.log(newMix);
  getMixes();
  return (await http.put(`/mixes/${newMix._id}`, newMix)).data;
};

function findMusic(music, mix) {
  if (!mix || !music) return -1;
  return mix.music.findIndex((m) => {
    return m === music._id;
  });
}

const isLikedMusic = (music) => {
  if (!mixes.value) return;
  const r = findMusic(music, mixes.value[0]);
  return r >= 0;
};

const addMusic = async (mixId: string, music) => {
  const mix = await getMix(mixId);
  mix.music.unshift(music);
  await putMix(mix);
  getMixes();
};

const removeMusic = async (mix, music) => {
  mix.music = mix.music.map((m) => m._id);
  const index = findMusic(music, mix);
  console.log(index, mix.music);
  mix.music.splice(index, 1);
  console.log(mix.music);
  await putMix(mix);
  getMixes();
};

const likeMusic = async (music) => {
  await addMusic(mixes.value[0]._id, music);
};

const unLikeMusic = async (music) => {
  const mix = await getMix(mixes.value[0]._id);
  await removeMusic(mix, music);
};

const addMix = async (name: string) => {
  await http.post("/mixes", {
    name,
  });
  getMixes();
};

const deleteMix = async (mixId) => {
  await http.delete("/mixes/" + mixId);
  getMixes();
};

const importMix = async (url: string) => {
  const result = (await http.post("/mixes/import", { url })).data;
  if (result.success && result.success === false) {
    showToast("导入失败");
  } else {
    showToast("导入成功");
  }
  getMixes();
};

export {
  mixes,
  getMixes,
  getMix,
  putMix,
  addMusic,
  likeMusic,
  removeMusic,
  unLikeMusic,
  addMix,
  deleteMix,
  findMusic,
  isLikedMusic,
  importMix,
};
