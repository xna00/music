import { ref, watch, watchEffect, computed } from "vue";
import http from "./http";
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
const playlist = ref<Music[]>([]);
playlist.value = JSON.parse(localStorage.playlist || "[]");

const index = ref<number>(0);
index.value = localStorage.index || 0;

const currentMusic = ref<MusicDetail>();
watch(
  playlist,
  (newPlaylist) => {
    localStorage.playlist = JSON.stringify(newPlaylist);
    console.log('deep');
    
  },
  {
    deep: true,
  }
);
watch([playlist, index], async ([newPlaylist, newIndex]: any) => {
  console.log(newPlaylist === playlist.value, newIndex);
  //index changed
  newIndex < 0 && (index.value = playlist.value.length - 1);
  newIndex >= playlist.value.length && (index.value = 0);
  localStorage.index = index.value;
  const musicDetail = (
    await http.post("/music/detail", playlist.value[index.value])
  ).data;
  currentMusic.value = musicDetail;
  //   return await http.post("/music/detail", playlist.value[index.value]);
  audio.src = currentMusic.value?.audioUrl || "";
  audio.load();
  audio.play();
});

const audio = new Audio();
currentMusic.value && (audio.src = currentMusic.value.audioUrl);

const currentTime = ref<number>(0);

const duration = ref<number>(0);

let checker;

const play = () => {
  audio.play();
  checker = setInterval(() => {
    currentTime.value = audio.currentTime;
    duration.value = audio.duration;
  });
};
function findMusic(music: MusicDetail | Music, mix?: any[]) {
  !mix && (mix = playlist.value);
  return mix.findIndex((m) => {
    return m.id === music.id && m.source === music.source;
  });
}
async function playFromSearchPage(music: Music) {
  if (findMusic(music) >= 0) {
    index.value = findMusic(music);
    return;
  }
  playlist.value.splice(index.value + 1, 0, music);
  next();
}

const pause = () => {
  audio.pause();
  clearInterval(checker);
};
let modes = ["单曲循环", "顺序播放", "随机播放"];
const mode = ref<number>(0);

watch(mode, () => {
  console.log(mode);
});

const changeMode = () => {
  mode.value++;
  mode.value >= modes.length && (mode.value = 0);
};

const next = () => {
  index.value++;
};

function previous() {
  index.value--;
}

function endedHandler() {
  switch (mode.value) {
    case 0:
      audio.play();
      break;
    case 1:
      next();
      break;
    case 2:
      index.value = parseInt(
        (Math.random() * playlist.value.length).toString()
      );
      break;
  }
}
audio.addEventListener("ended", endedHandler);

export {
  playlist,
  index,
  currentMusic,
  currentTime,
  duration,
  play,
  pause,
  mode,
  changeMode,
  next,
  previous,
  playFromSearchPage,
};
