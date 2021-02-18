<script lang="ts">
import {
  currentMusic,
  currentTime,
  play,
  pause,
  playing,
} from "../../lib/audio";
import Icon from "../../components/Icon.vue";
import PlaylistIcon from "./PlaylistIcon.vue";
export default {
  components: { Icon, PlaylistIcon },
  setup() {
    function toggle() {
      playing.value ? pause() : play();
    }
    return {
      currentMusic,
      currentTime,
      toggle,
      playing,
    };
  },
};
</script>
<template>
  <div
    @click="$router.push('/play')"
    class="footer d-flex ai-center px-2 pb-2 pt-1"
  >
    <component
      :is="currentMusic.image"
      :key="currentMusic.imageUrl"
      :style="{ objectFit: 'cover' }"
    />
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
    <PlaylistIcon />
  </div>
</template>
<style lang="scss" scoped>
.hit {
  color: red;
}
.footer {
  border-top: 1px solid;
  font-size: 25px;
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
