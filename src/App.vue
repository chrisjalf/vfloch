<template>
  <TheHeader />
  <router-view></router-view>
</template>

<script setup>
import TheHeader from "./layout/TheHeader.vue";
</script>

<style lang="scss">
@import "bootstrap/dist/css/bootstrap.css";
@import "bootstrap-icons/font/bootstrap-icons.css";

/* import the required styles */
@import "@vue-flow/core/dist/style.css";

/* import the default theme (optional) */
@import "@vue-flow/core/dist/theme-default.css";

@import "@vue-flow/controls/dist/style.css";
@import "@vue-flow/minimap/dist/style.css";
</style>
