<template>
  <div class="card">
    <div class="card-header">
      <i class="bi bi-clock-fill"></i>
      {{ label }}
    </div>
    <div class="card-body">
      <p class="card-text">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { label, data } = defineProps(["id", "label", "data"]);
const description = computed(() => `${label} - ${data.timezone}`);
</script>

<style scoped>
.card {
  max-width: 200px;
}

.card-header {
  background-color: orange;
}
</style>
