import netease from "./netease";

export class Source {
  search(keyword: string) {
    return Promise.resolve([new Music()]);
  }
  getDetail(music: Music) {
    return Promise.resolve(new MusicDetail());
  }
}
export class Music {
  id = "";
  source = "";
  name = "";
  album = "";
  artists: string[] = [];
}
export class MusicDetail extends Music {
  audioUrl = "";
  imageUrl = "";
  lyric = "";
}
export default {
  netease,
};
