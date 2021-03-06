import { Music, MusicDetail } from "./index";
import { Source } from ".";
import http from "../http";
const sourceName = "kuwo";
async function search(keyword: string) {
  const url = `http://search.kuwo.cn/r.s?ft=music&rformat=json&encoding=utf8&rn=10&callback=song&vipver=MUSIC_8.0.3.1`;

  const code = (await http.get(url, { SONGNAME: keyword }))
    .toString()
    .replace(/&nbsp;/g, " ");
  const res = eval(`const song = j => j; ${code}`);
  return res.abslist.map(
    (m): Music => {
      return {
        source: sourceName,
        id: m.MUSICRID,
        name: m.SONGNAME,
        artists: m.ARTIST.split("/"),
        album: m.ALBUM,
      };
    }
  );
}
const getDetail = async (music) => {
  const audioUrl = await http.get(
    `http://antiserver.kuwo.cn/anti.s?response=url&rid=${music.id}&format=mp3&type=convert_url`
  );
  const rawId = music.id.split("_")[1];
  const data = ((await http.get(
    `http://m.kuwo.cn/newh5app/api/mobile/v1/music/info/${rawId}`
  )) as any).data;
  const imageUrl = data.info.pic;
  const lyricArray = data.lrc;
  const lyric = lyricArray.map((l) => `[${l.time}]${l.lineLyric}`).join("\n");
  return {
    ...music,
    audioUrl,
    imageUrl,
    lyric,
  };
};
const importMix = async () => {
  return {
    name: "",
    music: [],
  };
};
const kuwo: Source = {
  search,
  getDetail,
  importMix,
};
export default kuwo;
