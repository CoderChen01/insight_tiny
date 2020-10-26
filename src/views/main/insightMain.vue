<template>
  <main-style>
    <template v-slot:nav>
      <nav-header></nav-header>
    </template>
    <template v-slot:main>
      <keep-alive>
        <router-view v-title="$route.meta.title"></router-view>
      </keep-alive>
      <router-view name="incidents"
                   v-title="$route.meta.title"></router-view>
    </template>
  </main-style>
</template>

<script>
  import mainStyle from "components/common/mainStyle"
  import navHeader from "components/content/nav/navHeader"

  export default {
    name: "insightMain",
    components: {
      mainStyle,
      navHeader
    }
  }
</script>

<style scoped>
</style>