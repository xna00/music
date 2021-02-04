<script lang="ts">
import { addMix, getMixes, putMix } from "../../../lib/mix";
import { ref } from "vue";
export default {
  props: {
    action: { type: String, default: "create" },
    mix: { type: Object },
  },
  setup(props, context) {
    const mixNameInput = ref<HTMLInputElement>();
    const emit = () => context.emit("update:open", false);
    const create = async () => {
      if (!mixNameInput.value?.value) return;
      await addMix(mixNameInput.value.value);
      emit();
      getMixes();
    };
    const update = async () => {
      if (!mixNameInput.value?.value) return;
      const mix = props.mix;
      mix.name = mixNameInput.value.value;
      await putMix(mix);
      emit();
      getMixes();
    };
    return {
      mixNameInput,
      addMix,
      emit,
      create,
      update,
    };
  },
};
</script>
<template>
  <Dialog>
    <div class="new-mix-dialog px-3 py-3">
      <div class="title">{{ action === "create" ? "新建" : "修改" }}歌单</div>
      <input type="text" ref="mixNameInput" />
      <div class="action">
        <button @click="emit">取消</button>
        <button @click="action === 'create' ? create() : update()">
          提交
        </button>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.new-mix-dialog {
  .title {
    font-size: 16px;
  }
  input {
    border: none;
    border-bottom: 1px solid black;
    border-radius: 0;
    font-size: 14px;
    line-height: 30px;
    width: 250px;
  }
  .action {
    text-align: end;
    padding-top: 20px;
    button {
      border: none;
      background: none;
      font-size: 16px;
      color: red;
      &:first-child {
        margin-right: 20px;
      }
    }
  }
}
</style>
