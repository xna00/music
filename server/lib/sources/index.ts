import netease from "./netease";
import qq from "./qq";
import kuwo from "./kuwo";
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
  // 本地能用，服务器上用不了，因为 IP 被屏蔽了吗？
  // kuwo,
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
      console.log("else if");
      let newMusicDetail = await sourceMap[music.source].getDetail(music);
      await MusicModel.findByIdAndUpdate(music._id, newMusicDetail);
      musicDetail = await MusicModel.findById(music._id);
    }
    return musicDetail;
  },
  async update(music: Music & { _id: string }) {
    let newMusicDetail = await sourceMap[music.source].getDetail(music);
    await MusicModel.findByIdAndUpdate(music._id, newMusicDetail);
    return await MusicModel.findById(music._id);
  },
  async importMix(url: string) {
    let id: string = "";
    let source;
    if (url.includes("music.163")) {
      source = "netease";
      const result = /(?<=playlist\/)[0-9]*(?=\/)/g.exec(url);
      if (!result || !result[0]) return false;
      id = result[0];
    } else if (url.includes("qq.com")) {
      source = "qq";
      let result;
      if ((result = /(?<=playlist\/)[0-9]*/g.exec(url))) {
      } else if ((result = /(?<=id=)[0-9]*/g.exec(url))) {
      } else {
        return false;
      }
      id = result[0];
    }
    if (!(id && source)) return false;
    console.log(true);
    const mix = await sourceMap[source].importMix(id);
    if (!mix.music.length) return false;
    // console.log("mix---", mix);
    mix.music = await Promise.all(
      mix.music.map(async (m) => {
        let music: any = await MusicModel.findOne({
          source: m.source,
          id: m.id,
        });
        if (!music) {
          music = await MusicModel.create(m);
        }
        return music;
      })
    );
    return mix;
  },
};
