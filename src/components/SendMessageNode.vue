<template>
  <div class="card">
    <div class="card-header">
      <i class="bi bi-send-fill"></i>
      {{ label }}
    </div>
    <div class="card-body">
      <h5 class="card-title">Message:</h5>
      <p class="card-text">{{ text }}</p>
      <p class="card-text" v-if="attachmentPayload?.attachment">
        {{ attachmentPayload.attachment }}
      </p>
    </div>
  </div>
</template>

<script setup>
const { data } = defineProps(["id", "label", "data"]);
const textPayload = data.payload.find((p) => p.type === "text");
const attachmentPayload = data.payload.find((p) => p.type === "attachment");

let text = textPayload.text ?? "-";
if (text.length > 50) text = text.slice(0, 50) + "...";
</script>

<style scoped>
.card {
  max-width: 200px;
}

.card-header {
  background-color: aquamarine;
}
</style>
