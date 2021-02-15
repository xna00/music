<script lang="ts">
import { ref } from "vue";
import { getUser } from "../../../lib/auth";

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
    return { logined, user, logout };
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
        <button v-if="!logined" @click="$router.push('/login')">
          点击登录
        </button>
        <div v-else class="h-100 d-flex flex-column">
          <div class="fs-xl">
            {{ user.username }}
          </div>
          <button @click="logout">注销</button>
        </div>
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
