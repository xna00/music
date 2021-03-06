import { ref, watch, watchEffect, computed } from "vue";
import http from "./http";
import { findMusic } from "./mix";
import showToast from "./showToast";
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
  image;
  lyric = "";
}
let firstTimeIndexChange = true;
const playlist = ref<Music[]>([]);
playlist.value = JSON.parse(localStorage.playlist || "[]");

const index = ref<number>(0);

watch([playlist, index], async ([newPlaylist, newIndex]: any) => {
  console.log(newPlaylist === playlist.value, newIndex);
  //index changed
  if (newIndex < 0) {
    index.value = playlist.value.length - 1;
    return;
  }
  if (newIndex >= playlist.value.length) {
    index.value = 0;
    return;
  }
  localStorage.index = index.value;
  const musicDetail = (
    await http.post("/music/detail", playlist.value[index.value])
  ).data;
  console.log(musicDetail);
  currentMusic.value = musicDetail;
  currentMusic.value.image = (
    <img
      src={musicDetail.imageUrl}
      style={{ width: "35px", height: "35px", borderRadius: "50%" }}
    />
  );
  let lyric: { time: number; text: string }[] = musicDetail.lyric
    .trim()
    .split("\n");
  lyric = lyric.map((l) => {
    let [timeString, text]: any = l.toString().split("]");
    timeString = timeString.replace("[", "");
    timeString = timeString.split(":");
    let time = timeString.reduce((previousValue, currentValue) => {
      previousValue *= 60;
      previousValue += parseFloat(currentValue) || 0;
      return previousValue;
    }, 0);
    text = text.trim();
    return {
      time,
      text,
    };
  });
  lyric = lyric.filter((l) => l.text);
  currentMusic.value!.parsedLyric = lyric;

  audio.src = currentMusic.value?.audioUrl || "";
  audio.load();
  if (firstTimeIndexChange) {
    firstTimeIndexChange = false;
    return;
  }
  audio.play();
});

index.value = localStorage.index || 0;

class CurrentMusic extends MusicDetail {
  parsedLyric: any[] = [];
  currentLyricIndex = 0;
  liked = false;
}
const currentMusic = ref<CurrentMusic>(new CurrentMusic());
watch(
  playlist,
  (newPlaylist) => {
    localStorage.playlist = JSON.stringify(newPlaylist);
    console.log("deep");
  },
  {
    deep: true,
  }
);
const audio = new Audio();
currentMusic.value && (audio.src = currentMusic.value.audioUrl);

const currentTime = ref<number>(0);

const duration = ref<number>(0);

audio.addEventListener(
  "durationchange",
  () => (duration.value = audio.duration)
);

audio.addEventListener("timeupdate", () => {
  currentTime.value = audio.currentTime;
  if (currentMusic.value && currentMusic.value.parsedLyric) {
    let i;
    for (
      i = currentMusic.value.parsedLyric.length - 1;
      i > 0 && currentTime.value < currentMusic.value.parsedLyric[i].time;
      i--
    ) {}
    currentMusic.value.currentLyricIndex = i;
  }
});
const playing = ref<boolean>(false);

let errorTime = 0;
audio.addEventListener("playing", () => (playing.value = true));
audio.addEventListener("pause", () => (playing.value = false));
audio.addEventListener("error", async (e) => {
  if (errorTime === 0) {
    errorTime = 1;
    const newMusic = (await http.patch("music/update", currentMusic.value))
      .data;
    audio.src = currentMusic.value.audioUrl = newMusic.audioUrl;
    audio.load();
    audio.play();
  } else {
    showToast("播放失败");
    errorTime = 0;
    next();
  }
});
audio.addEventListener("loadeddata", () => (errorTime = 0));

const play = () => {
  audio.play();
};
function playFromSearchPage(music: Music) {
  const newIndex = playlist.value.findIndex(
    (m) => m.id === music.id && m.source === music.source
  );
  if (newIndex >= 0) {
    index.value = newIndex;
    return;
  }
  playlist.value.splice(index.value + 1, 0, music);
  next();
}
function palyFromMixPage(musics: Music[], newIndex: number) {
  playlist.value = musics;
  index.value = newIndex;
}

const pause = () => {
  audio.pause();
};
let modes = ["单曲循环", "顺序播放", "随机播放"];
const mode = ref<number>(0);
mode.value = parseInt(localStorage.mode) || 0;

const changeMode = () => {
  mode.value++;
  mode.value >= modes.length && (mode.value = 0);
  localStorage.mode = mode.value;
  showToast(modes[mode.value]);
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

function seek(scale) {
  audio.currentTime = audio.duration * scale;
}

export {
  playlist,
  index,
  currentMusic,
  currentTime,
  duration,
  playing,
  play,
  pause,
  seek,
  mode,
  changeMode,
  next,
  previous,
  playFromSearchPage,
  palyFromMixPage,
};
