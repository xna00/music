<script lang="ts">
import Layout from "../components/Layout.vue";
import Header from "../components/Header.vue";
import Icon from "../../components/Icon.vue";
import LinearSeekBar from "../../components/LinearSeekBar.vue";
import {
  currentMusic,
  currentTime,
  duration,
  playing,
  play,
  pause,
  previous,
  next,
  mode,
  changeMode,
} from "../../lib/audio";
import { computed } from "vue";
export default {
  components: { Layout, Header, Icon, LinearSeekBar },

  setup() {
    function toggle() {
      playing.value ? pause() : play();
    }
    const timeFormat = (seconds) => {
      const date = new Date(seconds * 1000);
      let m = date.getMinutes().toString();
      let s = date.getSeconds().toString();
      console.log(m, s);
      m.length < 2 && (m = "0" + m);
      s.length < 2 && (s = "0" + s);
      s.length > 2 && (s = s.substr(0, 2));
      return m + ":" + s;
    };

    const formatedCurrentTime = computed(() => timeFormat(currentTime.value));
    const formatedDuration = computed(() => timeFormat(duration.value));
    const process = computed(() => currentTime.value / duration.value);

    const modeIcon = ["single-2", "xunhuan", "jiaochahulianxiang"];
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
      mode,
      changeMode,
      timeFormat,
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
        <Header>
          <Icon name="left" />
          <div class="info">
            <span>{{ currentMusic.name }}</span>
            <span>{{ currentMusic.artists.join("/") }}</span>
          </div>
          <Icon />
        </Header>
      </template>

      <template v-slot:footer>
        <div class="action-1"></div>
        <div class="seekbar-wrapper d-flex jc-between ai-center">
          <span class="px-2">{{ formatedCurrentTime }}</span>
          <LinearSeekBar :process="process" />
          <span class="px-2">{{ formatedDuration }}</span>
        </div>
        <div class="action-2 py-3 d-flex jc-around ai-center">
          <Icon @click="changeMode" :name="modeIcon[mode]" />
          <Icon @click="previous" name="previous" />
          <Icon @click="toggle" :name="playing ? 'pause' : 'play'" />
          <Icon @click="next" name="next" />
          <Icon name="menu" />
        </div>
      </template>
    </Layout>
  </div>
</template>
<style lang="scss" scoped>
.seekbar-wrapper {
  span {
    &:first-child {
    }
  }
  .seekbar {
    background: chartreuse;
  }
}
.action-2 {
  font-size: 25px;
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
