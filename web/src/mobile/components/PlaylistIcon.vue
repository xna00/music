<script lang="ts">
import Icon from "../../components/Icon.vue";
import BottomSheet from "../components/BottomSheet.vue";
import { ref } from "vue";
import { playlist, index } from "../../lib/audio";
export default {
  components: { Icon, BottomSheet },
  setup() {
    const listOpen = ref(false);
    return {
      listOpen,
      playlist,
      index,
    };
  },
};
</script>
<template>
  <Icon @click.stop="listOpen = true" name="list1" />
  <BottomSheet v-model:open="listOpen" height="50vh">
    <template v-slot:header>
      <div class="px-3 fs-xl">列表 ({{ playlist.length }})</div>
    </template>
    <ul>
      <li
        v-for="(m, i) in playlist"
        @click="index = i"
        class="px-3 py-2 fs-lg"
        :class="{ playing: index == i }"
      >
        {{ m.name }}
      </li>
    </ul>
  </BottomSheet>
</template>
<style lang="scss" scoped>
li.playing {
  color: red;
}
</style>
