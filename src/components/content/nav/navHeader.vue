<template>
  <div class="nav">
    <!--menu start-->
    <div class="menu">
      <el-menu mode="horizontal"
               :default-active="this.$route.name"
                @select="handleSelect">
        <!-- logo start -->
        <li class="logo el-menu-item" @click="returnMain">
          <h1>
            <img src="~assets/img/logo.png" alt="logo" width="130">
          </h1>
        </li>

        <!--menu items start-->
        <el-menu-item v-for="(item, i) in navItemsList" :key="i" :index="item.index">{{ item.name }}
        </el-menu-item>
        <!--menu items end-->
      </el-menu>

    </div>
    <!--menu end-->
  </div>
</template>

<script>
  export default {
    name: "navHeader",
    data() {
      return {
        navItemsList: [
          {index: 'incidentManagement', name: '事件查询'}
        ]
      }
    },
    created() {
      if (this.$route.name === 'index') {
        this.$router.push({name: 'incidentManagement'})
      }
    },
    methods: {
      handleSelect(index) {
        if (this.$route.name !== index){
          return this.$router.replace({name: index})
        }
      },
      returnMain() {
        if (this.$route.name !== 'incidentManagement') {
          this.$router.push({name: 'incidentManagement'})
        }
      }
    }
  }
</script>

<style scoped>
  .nav {
    width: 1200px;
    margin: 0 auto;
  }
  .logo {
    position: relative;
    bottom: 5px;
    margin-right: 20px;
  }
  .menu {
    user-select: none;
  }
</style>