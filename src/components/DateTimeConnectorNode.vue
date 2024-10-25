<template>
  <div class="rounded bg-primary">
    <div class="dt-connector-label">
      {{ label }}
    </div>

    <Handle type="target" :position="Position.Top" :connectable="false" />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup>
import { Handle, Position } from "@vue-flow/core";

defineProps(["id", "label"]);
</script>

<style scoped>
.dt-connector-label {
  color: #fff;
  padding: 0.5rem;
}
</style>
