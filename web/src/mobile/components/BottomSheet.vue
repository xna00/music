<script lang="ts">
import { ref, onMounted } from "vue";
export default {
  props: {
    open: { type: Boolean, default: false },
    height: { type: String, default: "auto" },
  },
};
</script>
<template>
  <teleport to="body">
    <transition name="slide-fade">
      <div @click.self="$emit('update:open', false)" v-if="open" class="modal">
        <div>
          <header>
            <slot name="header" />
          </header>
          <main class="flex-1" :style="{ height }">
            <slot />
          </main>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.25s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
.modal > div {
  background-color: white;
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  > header {
    border-bottom: 1px solid black;
    padding: 8px 0;
  }
  > main {
    overflow: auto;
  }
}
.modal {
  position: absolute;
  top: -100vh;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  z-index: 99999;
}
</style>
