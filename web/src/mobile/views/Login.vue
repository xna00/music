<script lang="ts">
import { ref } from "vue";
import { login, register as _register } from "../../lib/auth";
export default {
  setup() {
    const usernameInput = ref<HTMLInputElement>();
    const passwordInput = ref<HTMLInputElement>();
    const confirmPasswordInput = ref<HTMLInputElement>();
    const isRegister = ref(false);
    const errorMessage = ref("");
    const register = async () => {
      if (!usernameInput.value!.value) {
        return;
      } else if (
        passwordInput.value!.value !== confirmPasswordInput.value!.value
      ) {
        errorMessage.value = "密码不一致";
      } else {
        const data = await _register(
          usernameInput.value!.value,
          passwordInput.value!.value
        );
        if (data?.username === usernameInput.value!.value) {
          login(usernameInput.value!.value, passwordInput.value!.value);
        }
      }
    };
    return {
      usernameInput,
      passwordInput,
      confirmPasswordInput,
      isRegister,
      login,
      register,
      errorMessage,
    };
  },
};
</script>
<template>
  <form
    @submit.prevent="
      !isRegister ? login(usernameInput.value, passwordInput.value) : register()
    "
  >
    <input
      ref="usernameInput"
      type="text"
      name="username"
      placeholder="用户名"
    />
    <input
      ref="passwordInput"
      type="password"
      name="password"
      placeholder="密码"
    />
    <input
      v-if="isRegister"
      ref="confirmPasswordInput"
      type="password"
      name="password"
      placeholder="确认密码"
    />
    <input v-if="!isRegister" type="submit" value="登录" />
    <input @click="isRegister = true" type="submit" value="注册" />
    <div>{{ errorMessage }}</div>
  </form>
</template>
<style lang="scss" scoped>
form {
  display: flex;
  height: 40vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  input {
    width: 50%;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 8px;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 0;
    &[type="submit"] {
      border: 1px solid;
      border-radius: 2px;
    }
  }
}
</style>
