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
  importMix(id: string) {
    return Promise.resolve({
      name: "",
      music: [new Music()],
    });
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
const sourceMap: { [k: string]: Source } = {
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
  async getDetail(music: Music & { _id?: string }) {
    let musicDetail = await MusicModel.findOne({
      source: music.source,
      id: music.id,
    });
    if (!musicDetail) {
      let newMusicDetail = await sourceMap[music.source].getDetail(music);
      musicDetail = await MusicModel.create(newMusicDetail);
    } else if (
      !(musicDetail.lyric && musicDetail.imageUrl && musicDetail.audioUrl)
    ) {
      let newMusicDetail = await sourceMap[music.source].getDetail(music);
      musicDetail = await MusicModel.findByIdAndUpdate(
        music._id,
        newMusicDetail
      );
    }
    return musicDetail;
  },
  async update(music: Music & { _id: string }) {
    let newMusicDetail = await sourceMap[music.source].getDetail(music);
    return await MusicModel.findByIdAndUpdate(music._id, newMusicDetail);
  },
  async importMix(url: string) {
    let id: string = "";
    let source;
    if (url.includes("music.163")) {
      source = "netease";
      const result = /(?<=playlist\/)[0-9]*(?=\/)/g.exec(url);
      if (!result || !result[0]) return false;
      id = result[0];
    }
    if (!id) return false;
    console.log(true);
    const mix = await sourceMap[source].importMix(id);
    // console.log("mix---", mix);
    mix.music = await Promise.all(
      mix.music.map(async (m) => {
        let music: any = await MusicModel.findOne({
          source: m.source,
          id: m.id,
        });
        console.log(music);
        if (!music) {
          music = await MusicModel.create(m);
        }
        return music;
      })
    );
    return mix;
  },
};
