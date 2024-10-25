<template>
  <div class="card">
    <div class="card-header">
      <i class="bi bi-lightning-charge-fill"></i>
      Trigger
    </div>
    <div class="card-body">
      <p class="card-text">{{ description }}</p>
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Handle, Position } from "@vue-flow/core";

const { data } = defineProps(["id", "data"]);
const description = computed(() => {
  return data.type === "conversationOpened" ? "Conversation Opened" : "N/A";
});
</script>

<style scoped>
.card {
  max-width: 200px;
}

.card-header {
  background-color: mediumvioletred;
}
</style>
