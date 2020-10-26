<template>
  <div class="management-page">
    <slot name="manamgeMain"></slot>
  </div>
</template>

<script>
  export default {
    name: "managementStyle"
  }
</script>

<style scoped>
  .management-page {
    margin: 0 auto;
    padding: 15px;
    width: 1134px;
    background: #FFFFFF;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
    overflow: hidden;
  }
</style>