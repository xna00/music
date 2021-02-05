<script lang="ts">
import { ref } from "vue";
export default {
  props: {
    asideVisible: { type: Boolean, default: false },
  },
  setup() {
    const logined = ref();
    logined.value = localStorage.token;
    return { logined };
  },
};
</script>
<template>
  <transition name="slide-fade">
    <aside
      v-if="asideVisible"
      @click.self="$emit('update:asideVisible', false)"
    >
      <div>
        <div v-if="logined">已登录</div>
      </div>
    </aside>
  </transition>
</template>
<style lang="scss" scoped>
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  > div {
    transform: translateX(-100%);
  }
}
aside {
  background: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.3s linear;
  > div {
    height: 100%;
    width: 65vw;
    background: white;
    transition: all 0.3s linear;
  }
}
</style>
