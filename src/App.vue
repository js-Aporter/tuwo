<template>
  <div id="main" class="app-main">
    <router-view></router-view>

    <!-- image/video/audio -->
    <Preview></Preview>
  </div>
</template>

<script>
  import Preview from './components/Preview'

  export default {
    components: {Preview},
    data() {
      return {
        theme: this.$store.state.app.themeColor
      }
    }
  }
</script>

<style lang="less">
  html, body {
    background: #f0f0f0;
    overflow: hidden;

    &, .app-main {
      width: 100%;
      height: 100%;
    }
  }

</style>
