import { Music } from "./index";
import { Source } from ".";
import http from "../http";
const sourceName = "kugou";
const search = async (keyword: string) => {
  const res = //   console.log(res);
  ((await http.get(
    "http://mobilecdn.kugou.com/api/v3/search/song?format=json&page=1&pagesize=10&showtype=1",
    {
      keyword,
    }
  )) as any).data.info;
  return res.map(
    (m): Music => {
      return {
        name: m.songname,
        id: m.hash + "|" + m.album_id,
        source: sourceName,
        album: m.album_name,
        artists: m.singername.split("/"),
      };
    }
  );
};
const getDetail = async (music: Music) => {
  const res = ((await http.get(
    `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=${
      music.id.split("|")[0]
    }&dfid=3MacBM2xEZ883bf52D2bhy3t&mid=76f689839c6357bf94e1633798f6a168&platid=4&album_id=${
      music.id.split("|")[1]
    }&_=1613556515532`
  )) as any).data;
  return {
    ...music,
    audioUrl: res.play_url,
    imageUrl: res.img,
    lyric: res.lyrics,
  };
};
const importMix = async (id: string) => {
  return {
    name: "",
    music: [],
  };
};
const kugou: Source = {
  search,
  getDetail,
  importMix,
};
export default kugou;
