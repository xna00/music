<script lang="ts">
import { onMounted, ref } from "vue";
export default {
  props: {
    time: { type: Number, default: 2000 },
  },
  setup(props) {
    const visible = ref(true);
    onMounted(() => {
      setTimeout(() => {
        visible.value = false;
      }, props.time);
    });
    return { visible };
  },
};
</script>
<template>
  <transition name="fade">
    <div v-if="visible" class="toast"><slot /></div>
  </transition>
</template>
<style lang="scss" scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.toast {
  position: fixed;
  z-index: 100;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0.7em;
  bottom: 10vh;
  padding: 0.7em 1em;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.2s;
}
</style>
