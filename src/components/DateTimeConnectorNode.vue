<template>
  <div class="rounded bg-primary">{{ label }}</div>
</template>

<script setup>
defineProps(["id", "label"]);
</script>

<style scoped>
div {
  color: #fff;
  padding: .5rem;
}
</style>
