<template>
  <div id="app">
    <ThreeScene />
  </div>
</template>

<script>
import ThreeScene from "./components/ThreeScene.vue";

export default {
  name: "App",
  components: {
    ThreeScene
  }
};
</script>

<style lang="stylus">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
