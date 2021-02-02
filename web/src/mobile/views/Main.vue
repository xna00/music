<script lang="ts">
import { ref } from "vue";
import Layout from "../components/Layout.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Icon from "../../components/Icon.vue";
import http from "../../lib/http";
export default {
  components: { Layout, Header, Icon, Footer },
  setup() {
    const mixes = ref({});
    const fetch = async () => {
      mixes.value = (await http.get("/mixes")).data;
    };
    fetch();
    return { mixes };
  },
};
</script>
<template>
  <Layout>
    <template v-slot:header>
      <Header class="bg-primary">
        <Icon name="menu" />
        <router-link to="/search">
          <Icon name="search" />
        </router-link>
      </Header>
    </template>
    <header>我的歌单 ({{ mixes.length }})</header>
    <ul class="px-3 pt-2">
      <li v-for="mix in mixes" :key="mix._id" class="d-flex ai-center">
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
        <Icon name="menu" />
      </li>
    </ul>
    <template v-slot:footer><Footer /></template>
  </Layout>
</template>
<style lang="scss" scoped>
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
