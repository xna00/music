<script lang="ts">
import { ref } from "vue";
import Layout from "../components/Layout.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Icon from "../../components/Icon.vue";
import http from "../../lib/http";
import { mixes, getMixes, addMix } from "../../lib/mix";
export default {
  components: { Layout, Header, Icon, Footer },
  setup() {
    getMixes();
    return { mixes, addMix };
  },
};
</script>
<template>
  <Layout>
    <template v-slot:header>
      <Header class="bg-primary py-3">
        <Icon name="menu" />
        <router-link to="/search">
          <Icon name="search" />
        </router-link>
      </Header>
    </template>
    <header class="px-3 pt-2 d-flex ai-center jc-between">
      <div class="text">我的歌单 ({{ mixes?.length }})</div>
      <div>
        <Icon @click="addMix(Date.now())" name="add" class="mr-3" />
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
        <Icon name="3dot" />
      </li>
    </ul>
    <template v-slot:footer><Footer /></template>
  </Layout>
</template>
<style lang="scss" scoped>
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
