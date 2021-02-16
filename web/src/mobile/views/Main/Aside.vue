<script lang="ts">
import { ref } from "vue";
import { getUser } from "../../../lib/auth";
import { importMix as _importMix } from "../../../lib/mix";
import showToast from "../../../lib/showToast";

export default {
  props: {
    asideVisible: { type: Boolean, default: false },
  },
  setup() {
    const logined = ref();
    logined.value = localStorage.token;
    const user = ref();
    const fetchUser = async () => {
      user.value = await getUser();
    };
    fetchUser();
    const logout = () => {
      localStorage.token = "";
      location.reload();
    };
    const open = ref(false);
    const urlInput = ref<HTMLInputElement>();
    const importMix = () => {
      if (!urlInput.value || !urlInput.value.value) {
        showToast("请输入url");
        return;
      }
      _importMix(urlInput.value.value);
      open.value = false;
    };
    return { logined, user, logout, open, urlInput, importMix };
  },
};
</script>
<template>
  <transition name="slide-fade">
    <aside
      v-if="asideVisible"
      @click.self="$emit('update:asideVisible', false)"
    >
      <Dialog v-model:open="open">
        <div class="new-mix-dialog px-3 py-3">
          <div class="title">
            导入歌单
          </div>
          <input type="text" ref="urlInput" placeholder="请输入url" />
          <div class="action">
            <button @click="open = false">取消</button>
            <button @click="importMix">
              提交
            </button>
          </div>
        </div>
      </Dialog>
      <div>
        <button v-if="!logined" @click="$router.push('/login')">
          点击登录
        </button>
        <div v-else class="h-100 d-flex flex-column">
          <div class="fs-xl">
            {{ user.username }}
          </div>
          <button @click="open = true">导入歌单</button>
          <button @click="logout">注销</button>
        </div>
      </div>
    </aside>
  </transition>
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
  transition: all 0.2s linear;
  > div {
    height: 100%;
    width: 65vw;
    background: white;
    transition: all 0.2s linear;
    button {
      width: 100%;
      border: 1px solid red;
      background: transparent;
      color: red;
      line-height: 2em;
    }
  }
}
</style>
