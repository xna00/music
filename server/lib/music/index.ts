import netease from "./netease";
import qq from "./qq";
import MusicModel from "../../models/Music";

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
const sourceMap = {
  netease,
  qq,
};
export default {
  getSources() {
    return Object.keys(sourceMap);
  },
  search(source: string, keyword: string) {
    return sourceMap[source].search(keyword);
  },
  async getDetail(music: Music) {
    let musicDetail = await MusicModel.findOne({
      id: music.id,
    });
    console.log(musicDetail);
    let newMusicDetail = await sourceMap[music.source].getDetail(music);
    if (!musicDetail) {
      musicDetail = await MusicModel.create(newMusicDetail);
    }
    musicDetail.audioUrl = newMusicDetail.audioUrl;
    musicDetail.save();
    return musicDetail;
  },
};
