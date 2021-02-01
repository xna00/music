import { Music, MusicDetail, Source } from "./index";
import http from "../http";
const search = async (keyword: string) => {
  const url = `http://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=1&n=20`;
  let result: any = await http.get(url, { w: keyword });
  result = result.substring(result.indexOf("(") + 1, result.length - 1);
  result = JSON.parse(result);
  result = result.data.song.list;

  const data: Music[] = result.map((song) => ({
    id: song.songmid,
    source: "qq",
    name: song.songname,
    artists: song.singer.map((s) => s.name),
    album: song.albumname,
    albumUrl: `https://imgcache.qq.com/music/photo/album_300/76/300_albumpic_${song.albumid}_0.jpg`,
  }));
  return data;
};
const getDetail = async (music: Music) => {
  const { id } = music;
  // audio
  const getAudioUrl =
    "https://u.y.qq.com/cgi-bin/musicu.fcg?" +
    "-=getplaysongvkey8903794139311827&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22" +
    "req%22%3A%7B%22module%22%3A%22CDN.SrfCdnDispatchServer%22%2C%22method%22%3A%22GetCdnDispatch%22%2C%22param%22%3A%7B%22guid%22%3A%226363169124%22%2C%22calltype%22%3A0%2C%22" +
    "userip%22%3A%22%22%7D%7D%2C%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%226363169124%22%2C%22" +
    "songmid%22%3A%5B%22" +
    id +
    "%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%220%22%2C%22" +
    "loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A0%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D";
  const getLyricUrl =
    "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=" +
    id +
    "&format=json&nobase64=1";
  let [audioUrl, lyric]: [any, any] = await Promise.all([
    http.get(getAudioUrl),
    http.get(getLyricUrl, null, {
      referer: "https://y.qq.com/portal/player.html",
    }),
  ]);

  audioUrl = JSON.parse(audioUrl);
  audioUrl = audioUrl.req_0.data.midurlinfo[0].purl;
  audioUrl = "http://ws.stream.qqmusic.qq.com/" + audioUrl;
  lyric = JSON.parse(lyric);
  lyric = lyric.lyric;

  const musicDetail: any = {
    ...music,
    audioUrl,
    lyric,
  };
  return musicDetail;
};
const qq: Source = {
  search,
  getDetail,
};
export default qq;
