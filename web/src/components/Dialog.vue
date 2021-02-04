<script lang="ts">
export default {
  props: {
    open: { type: Boolean, default: true },
  },
};
</script>
<template>
  <teleport to="body">
    <div @click.self="$emit('update:open', false)" v-if="open" class="modal">
      <div>
        <slot />
      </div>
    </div>
  </teleport>
</template>
<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > div {
    background: white;
    border-radius: 8px;
  }
}
</style>
