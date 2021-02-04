<script lang="ts">
import { ref } from "vue";
import Layout from "../components/Layout.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Icon from "../../components/Icon.vue";
import BottomSheet from "../components/BottomSheet.vue";
import Dialog from "../../components/Dialog.vue";
import EditMixDialog from "./Main/EditMixDialog.vue";
import { mixes, getMixes, addMix, deleteMix } from "../../lib/mix";
import { login } from "../../lib/auth";
export default {
  components: {
    Layout,
    Header,
    Icon,
    Footer,
    Dialog,
    BottomSheet,
    EditMixDialog,
  },
  setup() {
    getMixes();
    const musicListOpen = ref(false);
    const selectedMix = ref();
    const newMixDialogOpen = ref(false);
    const action = ref("create");
    const asideVisible = ref(false);
    const username = ref();
    const password = ref();
    return {
      mixes,
      addMix,
      musicListOpen,
      selectedMix,
      deleteMix,
      newMixDialogOpen,
      action,
      asideVisible,
      login,
      username,
      password,
    };
  },
};
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s linear;
}

.slide-fade-leave-active {
  transition: all 0.8s linear;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-240px);
  opacity: 0;
}
aside {
  background: none;
  transition: background-color 0.3s;
  &.visible {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    > div {
      height: 100%;
      width: 70%;
      background: white;
    }
  }
}
</style>
<template>
  <aside @click.self="asideVisible = false" :class="{ visible: asideVisible }">
    <transition name="slide-fade">
      <div v-if="asideVisible">
        <div>
          <label>username <input type="text" v-model="username"/></label>
          <label>password <input type="password" v-model="password"/></label>
          <input @click="login(username, password)" type="submit" value="" />
        </div>
      </div>
    </transition>
  </aside>
  <EditMixDialog
    v-model:open="newMixDialogOpen"
    :action="action"
    :mix="selectedMix"
  />
  <BottomSheet v-model:open="musicListOpen">
    <template v-slot:header>
      <div class="px-3 py-2">歌单：{{ selectedMix.name }}</div>
    </template>
    <div @click="musicListOpen = false" class="mix-action px-3">
      <div
        @click="
          newMixDialogOpen = true;
          action = 'update';
        "
      >
        编辑
      </div>
      <div @click="deleteMix(selectedMix._id)">删除</div>
    </div>
  </BottomSheet>
  <Layout>
    <template v-slot:header>
      <Header class="bg-primary py-3">
        <Icon @click="asideVisible = true" name="menu" />
        <router-link to="/search">
          <Icon name="search" />
        </router-link>
      </Header>
    </template>
    <header class="px-3 pt-2 d-flex ai-center jc-between">
      <div class="text">我的歌单 ({{ mixes?.length }})</div>
      <div>
        <Icon
          @click="
            newMixDialogOpen = true;
            action = 'create';
          "
          name="add"
          class="mr-3"
        />
        <Icon name="3dot" />
      </div>
    </header>
    <ul class="px-3 pt-2">
      <li
        v-for="mix in mixes"
        :key="mix._id"
        @click="$router.push('/mix/' + mix._id)"
        class="d-flex ai-center pb-2"
      >
        <img
          src="http://p4.music.126.net/66TVKnEXRyT3s1AOHnf1Mw==/84662395345207.jpg?param=34y34"
          alt=""
          width="45"
          class="cover"
        />
        <div class="pl-2 d-flex flex-column jc-center title">
          <span class="fs-lg">{{ mix.name }}</span>
          <span class="fs-sm">{{ mix.music.length }}首</span>
        </div>
        <Icon
          @click.stop="
            selectedMix = mix;
            musicListOpen = true;
          "
          name="3dot"
        />
      </li>
    </ul>
    <template v-slot:footer><Footer /></template>
  </Layout>
</template>
<style lang="scss" scoped>
.mix-action {
  > div {
    font-size: 16px;
    padding: 8px 0;
  }
}
header {
  font-size: 18px;
  font-weight: bolder;
}
ul {
  font-size: 20px;
}
.cover {
  border-radius: 3px;
}
.title {
  margin-right: auto;
}
</style>
