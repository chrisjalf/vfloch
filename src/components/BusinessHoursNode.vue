<template>
  <div class="card">
    <div class="card-header">
      <i class="bi bi-clock-fill"></i>
      {{ label }}
    </div>
    <div class="card-body">
      <p class="card-text">{{ description }}</p>
    </div>

    <Handle type="target" :position="Position.Top" />
    <Handle
      type="source"
      :position="Position.Bottom"
      :connectable="false"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Handle, Position } from "@vue-flow/core";

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
