<script lang="ts">
import Layout from "../components/Layout.vue";
import Header from "../components/Header.vue";
import Icon from "../../components/Icon.vue";
import PlaylistIcon from "../components/PlaylistIcon.vue";
import LinearSeekBar from "../../components/LinearSeekBar.vue";
import {
  currentMusic,
  currentTime,
  duration,
  playing,
  play,
  pause,
  seek,
  previous,
  next,
  mode,
  changeMode,
} from "../../lib/audio";
import { likeMusic, unLikeMusic, isLikedMusic } from "../../lib/mix";
import { computed, ref } from "vue";
import Lyric from "./Play/Lyric.vue";
import timeFormat from "../../lib/timeFormat";
export default {
  components: { Layout, Header, Icon, LinearSeekBar, PlaylistIcon, Lyric },

  setup() {
    function toggle() {
      playing.value ? pause() : play();
    }

    const formatedCurrentTime = computed(() => timeFormat(currentTime.value));
    const formatedDuration = computed(() => timeFormat(duration.value));
    const process = computed(() => currentTime.value / duration.value);

    const modeIcon = ["single-2", "xunhuan", "jiaochahulianxiang"];

    const imageVisible = ref(false);
    const showToggle = () => (imageVisible.value = !imageVisible.value);

    return {
      modeIcon,
      currentMusic,
      formatedCurrentTime,
      formatedDuration,
      process,
      toggle,
      playing,
      previous,
      next,
      seek,
      mode,
      changeMode,
      timeFormat,
      imageVisible,
      showToggle,
      likeMusic,
      unLikeMusic,
      isLikedMusic,
    };
  },
};
</script>
<template>
  <div class="wrapper">
    <div
      class="background"
      :style="{ backgroundImage: `url(${currentMusic.imageUrl})` }"
    />
    <Layout>
      <template v-slot:header>
        <Header class="pt-1">
          <Icon @click="$router.back" name="left" />
          <div class="info">
            <span>{{ currentMusic.name }}</span>
            <span>{{ currentMusic.artists.join("/") }}</span>
          </div>
          <Icon />
        </Header>
      </template>
      <div @click="showToggle" class="main-wrapper h-100">
        <div class="img-wrapper" :class="{ invisible: !imageVisible }">
          <img
            :src="currentMusic.imageUrl"
            :style="{ animationPlayState: playing ? 'running' : 'paused' }"
          />
        </div>
        <Lyric :imageVisible="imageVisible" />
      </div>
      <template v-slot:footer>
        <div class="action-1">
          <div class="py-2 d-flex jc-around">
            <Icon
              @click="
                isLikedMusic(currentMusic)
                  ? unLikeMusic(currentMusic)
                  : likeMusic(currentMusic)
              "
              :name="isLikedMusic(currentMusic) ? 'heart-red' : 'heart'"
            />
            <Icon name="3dot-menu" />
          </div>
        </div>
        <div class="seekbar-wrapper d-flex jc-between ai-center">
          <span class="px-2">{{ formatedCurrentTime }}</span>
          <LinearSeekBar
            @seek="seek"
            :process="process"
            backgroundColor="white"
          />
          <span class="px-2">{{ formatedDuration }}</span>
        </div>
        <div class="action-2 py-3 d-flex jc-around ai-center">
          <Icon @click="changeMode" :name="modeIcon[mode]" />
          <Icon @click="previous" name="previous" />
          <Icon @click="toggle" :name="playing ? 'pause' : 'play'" />
          <Icon @click="next" name="next" />
          <PlaylistIcon />
        </div>
      </template>
    </Layout>
  </div>
</template>
<style lang="scss" scoped>
@keyframes rotate {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(360deg);
  }
}
.invisible {
  opacity: 0;
}
.main-wrapper {
  overflow: auto;
  position: relative;
  .img-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    > img {
      width: 60vw;
      border-radius: 50%;
      border: 3px solid #676666;
      animation: rotate 30s linear infinite;
    }
  }
}
.action-1 {
  font-size: 20px;
  color: white;
}
.action-2 {
  font-size: 25px;
  color: white;
  svg {
    &:nth-child(3) {
      font-size: 45px;
    }
  }
}
.info {
  margin-left: 8px;
  margin-right: auto;
  span {
    display: block;
    &:first-child {
      font-size: 18px;
    }
    &:last-child {
      font-size: 14px;
    }
  }
}
.wrapper {
  position: relative;
  overflow: hidden;
  .background {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #161824;
    background-size: auto 100%;
    background-position: 50%;
    transform: scale(1.5);
    transform-origin: center center;
    filter: blur(30px);
    z-index: -1;
    &::before {
      content: " ";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
