<script lang="ts">
import {
  currentMusic,
  currentTime,
  play,
  pause,
  playing,
  playlist,
  index,
} from "../../lib/audio";
import Icon from "../../components/Icon.vue";
import BottomSheet from "../components/BottomSheet.vue";
import { ref } from "vue";
export default {
  components: { Icon, BottomSheet },
  setup() {
    function toggle() {
      playing.value ? pause() : play();
    }
    const listOpen = ref(false);
    return {
      currentMusic,
      currentTime,
      toggle,
      playing,
      listOpen,
      playlist,
      index,
    };
  },
};
</script>
<template>
  <BottomSheet v-model:open="listOpen">
    <template v-slot:header>
      <div class="px-3 fs-xl">列表 ({{ playlist.length }})</div>
    </template>
    <ul>
      <li
        v-for="(m, i) in playlist"
        @click="index = i"
        class="px-3 py-2 fs-lg"
        :class="{ hit: index == i }"
      >
        {{ m.name }}
      </li>
    </ul>
  </BottomSheet>
  <div
    @click="$router.push('/play')"
    class="footer d-flex ai-center px-2 pb-2 pt-1"
  >
    <img :src="currentMusic?.imageUrl" alt="" />
    <div class="info flex-1">
      <span class="fs-lg">{{ currentMusic?.name }}</span>
      <span v-if="currentMusic?.parsedLyric" class="fs-sm text-ellipsis">{{
        currentMusic?.parsedLyric[currentMusic?.currentLyricIndex]?.text
      }}</span>
    </div>
    <Icon
      @click.stop="toggle"
      class="mr-3"
      :name="playing ? 'pause' : 'play'"
    />
    <Icon @click.stop="listOpen = true" name="list1" />
  </div>
</template>
<style lang="scss" scoped>
.hit {
  color: red;
}
.footer {
  border-top: 1px solid;
  font-size: 25px;
  > img {
    width: 35px;
    border-radius: 50%;
  }
  > .info {
    margin-left: 8px;
    margin-right: auto;
    overflow: hidden;
    > span {
      display: block;
    }
  }
}
</style>
