<script lang="ts">
import { ref } from "vue";
import Icon from "../../components/Icon.vue";
export default {
  props: {
    music: { type: Object },
  },
  components: { Icon },
  setup() {
    const open = ref(false);
    return { open };
  },
};
</script>
<style lang="scss" scoped>
.main {
  div {
    font-size: 16px;
    padding: 8px 0;
  }
}
</style>
<template>
  <li class="music px-3 d-flex jc-between ai-center py-2 flex-1">
    <BottomSheet v-model:open="open">
      <template v-slot:header>
        <div class="px-3 py-2 fs-xl">
          {{ music.name }}
        </div>
      </template>
      <div @click="open = false" class="main px-3">
        <slot name="list-item" />
      </div>
    </BottomSheet>
    <div>
      <span class="name text-ellipsis">{{ music.name }}</span>
      <span class="info">{{ music.artists?.join("/") }}</span>
    </div>
    <!-- <div> -->
    <Icon @click.stop="open = true" name="3dot" />
    <!-- </div> -->
  </li>
</template>
<style lang="scss" scoped>
.music {
  font-size: 20px;
  > div {
    overflow: hidden;
    span {
      display: block;
      overflow: hidden;
      &.name {
        font-size: 16px;
      }
      &.info {
        font-size: 10px;
      }
    }
  }
}
</style>
