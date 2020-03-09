<template>
  <div class="threeScene">
    <button v-on:click="requestSession">start ar</button>
  </div>
</template>

<script>
import ThreeScene from "@/classes/ThreeScene";
import WebXRController from "@/controllers/WebXRController";

export default {
  name: "ThreeScene",
  mounted() {
    WebXRController.initXR();
  },
  methods: {
    requestSession: function() {
      WebXRController.onRequest();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus"></style>
