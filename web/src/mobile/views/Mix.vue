<script lang="ts">
import { getMix } from "../../lib/mix";
import { palyFromMixPage } from "../../lib/audio";
import { ref } from "vue";
import Layout from "../components/Layout.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Music from "../components/Music.vue";
import Icon from "../../components/Icon.vue";
export default {
  components: { Layout, Header, Footer, Music, Icon },
  props: {
    id: { type: String },
  },
  setup(props) {
    const mix = ref();
    async function fetch() {
      mix.value = await getMix(props.id);
    }
    fetch();
    return { mix, palyFromMixPage };
  },
};
</script>
<template>
  <Layout>
    <template v-slot:header>
      <Header class="text-white bg-primary py-3">
        <router-link to="/main">
          <Icon name="left" />
        </router-link>
        <span class="mix-name ml-2">{{ mix?.name }}</span>
        <div>
          <Icon name="search" class="mr-3" />
          <Icon name="3dot" />
        </div>
      </Header>
    </template>
    <ul v-if="mix">
      <li
        class="d-flex ai-center"
        v-for="(m, i) in mix.music"
        @click="palyFromMixPage(mix.music, i)"
      >
        <span class="pl-3 pr-1">{{ i + 1 }}</span>
        <Music :music="m" />
      </li>
    </ul>
    <template v-slot:footer>
      <Footer />
    </template>
  </Layout>
</template>
<style lang="scss" scoped>
.mix-name {
  margin-right: auto;
}
</style>
