<script lang="ts">
import Layout from "../components/Layout.vue";
import Header from "../components/Header.vue";
import Icon from "../../components/Icon.vue";
export default {
  components: { Layout, Header, Icon },
};
</script>
<template>
  <Layout>
    <template v-slot:header>
      <Header>
        <div class="d-flex jc-between px-3 header">
          <Icon name="menu" />
          <Icon name="search" />
        </div>
      </Header>
    </template>
    
  </Layout>
</template>
<style lang="scss" scoped>
.header {
  font-size: 1.6rem;
  color: white;
}
</style>
