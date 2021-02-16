const encSeckey =
  "d2f8c6aa02d26f0c89691a673e487bc0b7d9f621f01db74dbc5b9489ca1953c4d24a30d38ff848ce8f4744e56c6889035ba61c04df722f4a791ec088cae9dd52de1e511a86782db13e707f2b1f60585b7fc39253ef97f39f2d06ac2c44c30c6de826ac1356aea41bbe998784b4f4f80438787ac65edcae99f5fe4be4d0f64a04";

import crypto = require("crypto");

function encrypt(data, key) {
  const iv = "0102030405060708";
  let encryptedData = "";
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  cipher.setAutoPadding(true);
  encryptedData += cipher.update(data, "utf8", "base64");
  encryptedData += cipher.final("base64");
  return encryptedData;
}

const encryptParams = (params) => {
  const firstKey = "0CoJUm6Qyw8W8jud";
  const secondKey = "SbVzNcpHh0E9EaQU";
  return encrypt(encrypt(JSON.stringify(params), firstKey), secondKey);
};

const hotMusic = {
  path: "/weapi/search/hot",
  params: { type: "1111" }, //固定的值
};
const searchSuggest = {
  path: "/weapi/search/suggest/keyword",
  params: {
    s: "又见", //关键词
  },
};
const search = {
  path: "/weapi/search/get",
  params: {
    s: "又见炊烟",
    limit: 20,
    offset: 0,
    type: 1,
    strategy: 5,
    queryCorrect: true,
  },
};
const song = {
  path: "/weapi/song/enhance/player/url/v1",
  params: { ids: "[227957]", level: "standard", encodeType: "aac" },
};
const lyric = {
  path: "/weapi/song/lyric",
  params: { id: 227957, lv: 0, tv: 0 },
};

import http from "../http";
import { Source, Music, MusicDetail } from "./index";
const request = (api) => {
  const encryptedParams = encryptParams(api.params);
  const formData = {
    params: encryptedParams,
    encSecKey: encSeckey,
  };
  return http.post("https://interface.music.163.com" + api.path, formData, {
    "accept-encoding": "gzip, deflate, br",
    "content-type": "application/x-www-form-urlencoded",
  });
};
const searchMusic = async (keyword: string) => {
  search.params.s = keyword;
  const result = await request(search);
  let rawData: any;
  // rawData = JSON.parse(result);
  rawData = result
  const data: Music[] = rawData.result.songs.map((song) => ({
    id: song.id.toString(),
    source: "netease",
    name: song.name,
    album: song.al.name,
    artists: song.ar.map((a) => a.name),
  }));
  return data;
};
const getDetail = async (music: Music) => {
  const { id } = music;
  let [detail, lyric]: [any, any] = await Promise.all([
    http.get(`http://music.163.com/api/song/detail/?id=${id}&ids=[${id}]`),
    http.get(
      `http://music.163.com/api/song/lyric?os=pc&id=${id}&lv=-1&kv=-1&tv=-1`
    ),
  ]);
  // detail = JSON.parse(detail);
  // lyric = JSON.parse(lyric);
  lyric = lyric.lrc.lyric;
  const song = detail.songs[0];

  const musicDetail: MusicDetail = {
    ...music,
    audioUrl: "https://music.163.com/song/media/outer/url?id=" + id + ".mp3",
    imageUrl: song.album.picUrl,
    lyric,
  };
  return musicDetail;
};
const netease: Source = {
  search: searchMusic,
  getDetail,
};
export default netease;
