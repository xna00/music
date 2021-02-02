<script lang="ts">
import Layout from "../components/Layout.vue";
import Header from "../components/Header.vue";
import Icon from "../../components/Icon.vue";

import http from "../../lib/http";
import { ref, onMounted, watch } from "vue";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";

// install Swiper components
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
export default {
  components: { Layout, Header, Icon, Swiper, SwiperSlide },
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
    return { input, sources, onSwiper, onSlideChange, activeIndex, search };
  },
};
</script>
<template>
  <Layout>
    <template v-slot:header>
      <Header class="bg-primary text-white">
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
              <li
                v-for="(r, index) in source.result"
                class="music px-3 d-flex jc-between ai-center py-2"
              >
                <div>
                  <span class="name text-ellipsis">{{ r.name }}</span>
                  <span class="info">{{ r.artists.join("/") }}</span>
                </div>
                <!-- <div> -->
                <Icon name="menu" />
                <!-- </div> -->
              </li>
            </ul>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </Layout>
</template>
<style lang="scss" scoped>
@import "@/assets/style/_variables.scss";
.info {
  > span {
    display: block;
  }
}
input {
  background: transparent;
  border: none;
  border-bottom: 1px solid whitesmoke;
}
.wrapper {
  overflow: auto;
  height: 100%;

  .music {
    font-size: 20px;
    > div {
      overflow: hidden;
    }
    span {
      display: block;
      overflow: hidden;
    }
    .name {
      font-size: 16px;
    }
    .info {
      font-size: 10px;
    }
  }
}
.swiper-container {
  width: 100%;
  flex: 1;
}
li.active {
  border-bottom: 2px solid white;
}
</style>
