<script lang="ts">
import { ref, watch, onMounted } from "vue";
import { currentMusic, seek, duration } from "../../../lib/audio";
import timeFormat from "../../../lib/timeFormat";
export default {
  props: {
    imageVisible: { type: Boolean, default: true },
  },
  setup() {
    const ul = ref<HTMLUListElement>();
    onMounted(() => {});
    const scroll = () => {
      if (
        !ul.value ||
        !currentMusic.value ||
        !ul.value.children[currentMusic.value.currentLyricIndex]
      )
        return;
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
        const parentElement = ul.value!.parentElement;
        const firstElementChild = <HTMLLIElement>ul.value!.firstElementChild;
        if (firstElementChild) {
          ul.value!.style.padding = `${parentElement.offsetHeight / 2 -
            firstElementChild.offsetHeight / 2}px 0`;
        }
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
      cancelScrolling = setTimeout(() => {
        scrolling.value = false;
        scroll();
        selectedIndex.value = -1;
      }, 3000);
    };
    const onScroll = () => {
      if (scrolling.value && ul.value) {
        let i = 0;
        const liList = ul.value.children;
        for (
          i = liList.length - 1;
          i > 0 &&
          ul.value.parentElement!.scrollTop <
            (liList[i] as HTMLLIElement).offsetTop -
              (liList[i] as HTMLLIElement).offsetHeight / 2 -
              (ul.value.firstElementChild as HTMLLIElement).offsetTop;
          i--
        ) {}
        selectedIndex.value = i;
      }
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
      onTouchmove,
      onScroll,
      ul,
      selectedIndex,
      seekBySeeker,
      scrolling,
      currentMusic,
      timeFormat,
    };
  },
};
</script>
<template>
  <div
    ref="lyricWrapper"
    class="lyric-wrapper"
    :class="{ invisible: imageVisible }"
    @touchmove="onTouchmove"
    @scroll="onScroll"
  >
    <div
      v-if="scrolling"
      class="seeker"
      :data-time="timeFormat(currentMusic.parsedLyric[selectedIndex]?.time)"
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
</template>
<style lang="scss" scoped>
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
    text-align: center;
    font-size: 16px;
    line-height: 3em;
    color: white;
    .selected {
      color: green;
    }
    .active {
      color: red;
    }
  }
}
</style>
