<script lang="ts">
import {
  currentMusic,
  currentTime,
  play,
  pause,
  playing,
} from "../../lib/audio";
import Icon from "../../components/Icon.vue";
export default {
  components: { Icon },
  setup() {
    function toggle() {
      playing.value ? pause() : play();
    }
    return { currentMusic, currentTime, toggle, playing };
  },
};
</script>
<template>
  <div
    @click="$router.push('/play')"
    class="footer d-flex ai-center px-2 pb-2 pt-1"
  >
    <img :src="currentMusic?.imageUrl" alt="" />
    <div class="info">
      <span class="fs-lg">{{ currentMusic?.name }}</span>
      <span v-if="currentMusic?.parsedLyric" class="fs-sm text-ellipsis">{{
        currentMusic?.parsedLyric[currentMusic?.currentLyricIndex]?.text
      }}</span>
    </div>
    <Icon
      @click.stop="toggle"
      class="mr-2"
      :name="playing ? 'pause' : 'play'"
    />
    <Icon name="menu" />
  </div>
</template>
<style lang="scss" scoped>
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
