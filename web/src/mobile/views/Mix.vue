<script lang="ts">
import { getMix, removeMusic, mixes, addMusic } from "../../lib/mix";
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
    const open = ref(false);
    return { mix, mixes, palyFromMixPage, removeMusic, fetch, open, addMusic };
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
        <span class="mix-name ml-2 text-ellipsis">{{ mix?.name }}</span>
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
        <Dialog v-model:open="open">
          <div class="new-mix-dialog px-3 py-3">
            <div class="title">收藏到歌单</div>
            <ul @click="open = false" class="mixes">
              <li v-for="mix in mixes" @click="addMusic(mix._id, m)">
                {{ mix.name }}
              </li>
            </ul>
          </div>
        </Dialog>
        <Music :music="m" class="flex-1">
          <template v-slot:list-item>
            <div class="list-item">
              <div @click="open = true">收藏到歌单</div>
              <div
                @click="
                  removeMusic(mix, m);
                  fetch();
                "
              >
                删除
              </div>
            </div>
          </template>
        </Music>
      </li>
    </ul>
    <template v-slot:footer>
      <Footer />
    </template>
  </Layout>
</template>
<style lang="scss" scoped>
.new-mix-dialog {
  min-width: 300px;
  .title {
    font-size: 16px;
    padding-bottom: 8px;
  }
  .mixes {
    li {
      padding: 8px 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.list-item {
  > div {
    font-size: 16px;
    padding: 8px 0;
  }
}
.mix-name {
  margin-right: auto;
}
</style>
