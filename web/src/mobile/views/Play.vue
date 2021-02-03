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
  seek,
  previous,
  next,
  mode,
  changeMode,
} from "../../lib/audio";
import { computed, onMounted, ref, watch } from "vue";
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
      m.length < 2 && (m = "0" + m);
      s.length < 2 && (s = "0" + s);
      s.length > 2 && (s = s.substr(0, 2));
      return m + ":" + s;
    };

    const formatedCurrentTime = computed(() => timeFormat(currentTime.value));
    const formatedDuration = computed(() => timeFormat(duration.value));
    const process = computed(() => currentTime.value / duration.value);

    const modeIcon = ["single-2", "xunhuan", "jiaochahulianxiang"];

    const imageVisible = ref(false);
    const showToggle = () => (imageVisible.value = !imageVisible.value);

    const ul = ref<HTMLUListElement>();
    const scroll = () => {
      if (!ul.value || !currentMusic.value) return;
      const lyricWrapper = ul.value.parentElement;
      lyricWrapper!.scrollTop =
        (ul.value.children[
          currentMusic.value.currentLyricIndex
        ] as HTMLLIElement).offsetTop -
        (ul.value.firstElementChild as HTMLLIElement).offsetTop;
    };
    watch(
      currentMusic,
      () => {
        if (scrolling.value) return;
        scroll();
      },
      { deep: true }
    );
    let scrolling = ref(false);
    let cancelScrolling;
    const selectedIndex = ref(-1);
    const onTouchmove = (e) => {
      clearTimeout(cancelScrolling);
      scrolling.value = true;
      if (ul.value) {
        let i = 0;
        const liList = ul.value.children;
        for (
          i = liList.length - 1;
          i >= 0 &&
          ul.value.parentElement!.scrollTop <
            (liList[i] as HTMLLIElement).offsetTop -
              (liList[i] as HTMLLIElement).offsetHeight / 2 -
              (ul.value.firstElementChild as HTMLLIElement).offsetTop;
          i--
        ) {}
        i < 0 && (i = 0);
        selectedIndex.value = i;
      }
      cancelScrolling = setTimeout(() => {
        scrolling.value = false;
        scroll();
        selectedIndex.value = -1;
      }, 3000);
    };
    const seekBySeeker = () => {
      if (currentMusic.value) {
        seek(
          currentMusic.value.parsedLyric[selectedIndex.value].time /
            duration.value
        );
      }
    };
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
      onTouchmove,
      ul,
      selectedIndex,
      seekBySeeker,
      scrolling,
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
        <div
          ref="lyricWrapper"
          class="lyric-wrapper"
          :class="{ invisible: imageVisible }"
          @touchmove="onTouchmove"
        >
          <div
            v-if="scrolling"
            class="seeker"
            :data-time="
              timeFormat(currentMusic.parsedLyric[selectedIndex].time)
            "
            @click.stop="seekBySeeker"
          />
          <ul ref="ul">
            <li
              v-for="(lrc, i) in currentMusic.parsedLyric"
              :key="lrc.time"
              :class="{
                active: i === currentMusic.currentLyricIndex,
                selected: i === selectedIndex,
              }"
            >
              {{ lrc.text }}
            </li>
          </ul>
        </div>
      </div>
      <template v-slot:footer>
        <div class="action-1">
          <div class="py-2 d-flex jc-around">
            <Icon name="menu" />
            <Icon name="menu" />
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
          <Icon name="menu" />
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
      width: 200px;
      border-radius: 50%;
      animation: rotate 30s linear infinite;
    }
  }

  .lyric-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    scroll-behavior: smooth;
    transition: opacity 0.3s;
    box-shadow: 0px 200px 35px 59px rgba(255, 255, 255, 0.01) inset;
    .seeker {
      position: absolute;
      background: red;
      width: 80%;
      height: 1px;
      left: 30px;
      top: 50%;
      transform: translateY(-50%);
      &::before {
        content: " ";
        // display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        left: -25px;
        top: 50%;
        transform: translateY(-50%);
        border: 8px solid transparent;
        border-left-color: black;
      }
      &::after {
        content: attr(data-time);
        position: absolute;
        left: 102%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    > ul {
      padding: 61% 0;
      text-align: center;
      font-size: 16px;
      font-weight: bolder;
      line-height: 2em;
      color: white;
      .selected {
        color: green;
      }
      .active {
        color: red;
      }
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
