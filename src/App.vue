<template>
  <div id="root">
      <router-view name="page404" v-title="$route.meta.title"></router-view>
      <router-view v-title="$route.meta.title"></router-view>
      <keep-alive>
        <router-view name="login" v-title="$route.meta.title"></router-view>
        <router-view name="forget-password" v-title="$route.meta.title"></router-view>
        <router-view name="register" v-title="$route.meta.title"></router-view>
      </keep-alive>
  </div>
</template>


<script>
  export default {
    name: 'App'
  }
</script>


<style>
  @import "assets/css/common.css";
</style>
