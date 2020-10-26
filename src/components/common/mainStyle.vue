<template>
  <el-container>
    <el-header height="61">
      <slot name="nav"></slot>
    </el-header>
    <el-main>
      <el-scrollbar class="main-scroll"
                    ref="mainScroll"
                    wrap-style="overflow: auto;"
                    view-style="overflow: hidden; margin-right: 17px"
                    style="height: 100%;">
        <slot name="main"></slot>
      </el-scrollbar>
    </el-main>
    <el-footer style="height: 50px">
      <div class="insight-copyright">
        <div class="footer">
          Copyright © 2020 coderchen01 in AHPU
          <br><span id="poweredby">Powered by Vue and Django</span>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
  import {ISSCROLLTOBOTTOM} from 'store/mutationTypes'

  export default {
    name: "mainStyle",

    data() {
      return {
        hasMounted: false
      }
    },

    computed: {
      hasScrollBar() {
        if (this.hasMounted) {
          return !!this.$refs.mainScroll.sizeHeight
        }
      }
    },

    watch: {
      hasScrollBar: function (val) {
        let scrollbarView = this.$refs.mainScroll.$refs.resize
        if (val) {
          scrollbarView.setAttribute('style', 'overflow: hidden;')
        } else {
          scrollbarView.setAttribute('style', 'overflow: hidden; margin-right: 17px')
        }
      }
    },

    mounted() {
      this.handleScroll()
      this.hasMounted = true
    },

    methods: {
      handleScroll() {
        let scrollbarEL = this.$refs.mainScroll.wrap
        scrollbarEL.onscroll = () => {
          this.$store.commit(
            ISSCROLLTOBOTTOM,
            scrollbarEL.scrollHeight - scrollbarEL.scrollTop === scrollbarEL.clientHeight
          )
        }
      }
    }
  }
</script>

<style scoped>
  .el-container {
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
  }
  .el-header {
    background: #FFFFFF;
    border-bottom: solid 1px #e6e6e6;
  }
  .el-main {
    margin: 0;
    padding: 10px 0 0 0;
    background: #f5f6f7;
  }
  .el-footer {
    background: #FFFFFF;
    box-shadow: 0 13px 16px 10px rgba(0,0,0,.05);
    overflow: hidden;
  }
  .insight-copyright {
    margin-top: 5px;
  }
  .footer {
    margin: 0 auto;
    font-size: 12px;
    line-height: 21px;
    text-align: center;
    color: rgb(55,55,55);
    width: 220px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }
</style>