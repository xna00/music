<script lang="ts">
import Icon from "../../components/Icon.vue";
export default {
  props: {
    music: { type: Object },
  },
  components: { Icon },
};
</script>
<template>
  <li class="music px-3 d-flex jc-between ai-center py-2">
    <div>
      <span class="name text-ellipsis">{{ music.name }}</span>
      <span class="info">{{ music.artists.join("/") }}</span>
    </div>
    <!-- <div> -->
    <Icon name="3dot" />
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
