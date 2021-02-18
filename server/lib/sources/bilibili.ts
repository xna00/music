import { Source, MusicDetail, Music } from ".";
import http from "../http";
const sourceName = "bilibili";
const search = async (keyword: string) => {
  const res = ((await http.get(
    "http://api.bilibili.com/x/web-interface/search/type",
    {
      search_type: "video",
      keyword,
      order: "totalrank",
      duration: 0,
      tids: 0,
      page: 1,
    }
  )) as any).data.result;
  const bvps: any[] = await Promise.all(
    res.map((r) =>
      http.get("http://api.bilibili.com/x/player/pagelist", {
        bvid: r.bvid,
      })
    )
  );
  const ret: Music[] = [];
  for (let i in bvps) {
    ret.push(
      ...bvps[i].data.map((p) => {
        return {
          source: sourceName,
          id: `${res[i].bvid}/${p.cid}`,
          name: p.part,
          album: res[i].title,
          artists: res[i].author.split("/"),
          imageUrl: res[i].pic,
        };
      })
    );
  }
  return ret;
};
const getDetail = async (music: Music & { imageUrl: string }) => {
  const [bvid, cid] = music.id.split("/");
  const res = ((await http.get("http://api.bilibili.com/x/player/playurl", {
    bvid,
    cid,
    qn: 0,
    fnval: 16,
    fnver: 0,
    fourk: 1,
  })) as any).data.dash.audio[0].baseUrl;
  const encoded_url = Buffer.from(res).toString("base64");

  return {
    ...music,
    audioUrl: `/api/proxy/blAudio/${encoded_url}`,
    lyric: "[0]无歌词",
  };
};
const importMix = async (id: string) => {
  return {
    name: "",
    music: [],
  };
};
const bilibili: Source = {
  search,
  getDetail,
  importMix,
};
export default bilibili;
