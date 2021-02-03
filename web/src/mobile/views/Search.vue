<script lang="ts">
import Layout from "../components/Layout.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Icon from "../../components/Icon.vue";
import Music from "../components/Music.vue";

import http from "../../lib/http";
import { playFromSearchPage } from "../../lib/audio";
import { ref, onMounted, watch } from "vue";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/swiper.scss";

// install Swiper components
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
export default {
  components: { Layout, Header, Icon, Swiper, SwiperSlide, Footer, Music },
  setup() {
    const sources = ref([]);
    const fetchSources = async () => {
      sources.value = (await http.get("/music/sources")).data.map((s) => ({
        name: s,
        result: null,
      }));
    };
    let swiper: any = null;
    const activeIndex = ref(0);
    fetchSources();
    const onSwiper = (s) => {
      swiper = s;
    };
    const input = ref<HTMLInputElement>();
    onMounted(() => {
      watch(activeIndex, (newValue) => swiper.slideTo(newValue));
    });
    const search = async () => {
      const keyword = input.value?.value;
      const source: any = sources.value[activeIndex.value];
      if (!keyword || source.keyword === keyword) return;

      source.keyword = keyword;
      source.result = (
        await http.get(`/music/${source.name}?keyword=${keyword}`)
      ).data;
    };
    const onSlideChange = () => {
      activeIndex.value = swiper.activeIndex;
      search();
    };
    return {
      input,
      sources,
      onSwiper,
      onSlideChange,
      activeIndex,
      search,
      playFromSearchPage,
    };
  },
};
</script>
<template>
  <Layout>
    <template v-slot:header>
      <Header class="bg-primary text-white py-3">
        <router-link to="/main">
          <Icon name="left" />
        </router-link>
        <input ref="input" type="text" class="flex-1 mx-3" />
        <Icon @click="search" name="search" />
      </Header>
    </template>
    <div class="h-100 d-flex flex-column">
      <ul class="d-flex jc-between pt-1 bg-primary text-white">
        <li
          v-for="(source, index) in sources"
          :key="source"
          class="flex-1 text-center pb-2"
          :class="{ active: index === activeIndex }"
          @click="activeIndex = index"
        >
          {{ source.name }}
        </li>
      </ul>
      <swiper
        :slides-per-view="1"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide v-for="source in sources">
          <div class="wrapper">
            <ul>
              <Music
                v-for="(r, index) in source.result"
                @click="playFromSearchPage(r)"
                :music="r"
              />
            </ul>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <template v-slot:footer><Footer /></template>
  </Layout>
</template>
<style lang="scss" scoped>
@import "@/assets/style/_variables.scss";
input {
  background: transparent;
  border: none;
  border-bottom: 1px solid whitesmoke;
}
.wrapper {
  overflow: auto;
  height: 100%;
}
.swiper-container {
  width: 100%;
  flex: 1;
}
li.active {
  border-bottom: 2px solid white;
}
</style>
