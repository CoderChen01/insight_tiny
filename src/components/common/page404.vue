<template>
  <div class="bg main">
    <div class="kaicz_404 container">
      <img src="~assets/img/404/404.gif" alt="404">
      <h2>抱歉，您访问的页面出错了</h2>
      <p>您可能输错了网址，或该网页已删除或不存在</p>
      <a href="javascript:void 0" class="btn btn-primary btn_blue" @click="returnIndex">返回主页</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "page404",
    methods: {
      returnIndex() {
        return this.$router.push({name: 'index'})
      }
    }
  }
</script>

<style scoped>
  .bg {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-color: #fafafa;
    background-size: cover;
    width: 100%;
    height: 100vh;
    overflow: auto
  }

  .main {
    position: relative;
  }

  .kaicz_404 {
    padding-top: 80px;
    padding-bottom: 112px;
  }

  .container {
    position: absolute;
    left: 50%;
    margin-left: -600px;
    width: 1170px;
  }

  .container {
    padding-right: 15px;
    padding-left: 15px;
  }

  .kaicz_404 img {
    display: block;
    margin: auto
  }

  .kaicz_404 h2 {
    font-size: 32px;
    color: #333333;
    text-align: center;
    letter-spacing: 5px;
    padding-top: 33px;
    padding-bottom: 25px
  }

  .kaicz_404 p {
    font-size: 14px;
    color: #666666;
    letter-spacing: 1px;
    text-align: center;
    padding-bottom: 35px
  }

  .btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px
  }

  .btn-primary {
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF
  }

  .btn_blue {
    display: inline-block;
    height: 56px;
    line-height: 56px;
    text-align: center;
    border-radius: 3px;
    background: #409EFF;
    color: #fff;
    letter-spacing: 5px;
    border: 0;
    font-size: 18px;
    padding: 0;
    text-decoration: none;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
    -webkit-transition-property: background;
    transition-property: background
  }

  .kaicz_404 a {
    display: block;
    margin: auto;
    width: 220px;
    height: 56px
  }
</style>