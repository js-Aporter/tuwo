<template>
  <div class="home-page">
    <img :src="require('../../images/home.png')">
    <!-- <h1>途窝文旅 - 后台管理系统</h1> -->
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
  }
</script>

<style>
  .home-page {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
