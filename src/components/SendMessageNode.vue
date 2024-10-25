<template>
  <div class="card">
    <div class="card-header">
      <i class="bi bi-send-fill"></i>
      {{ label }}
    </div>
    <div class="card-body">
      <h5 class="card-title">Message:</h5>
      <p class="card-text">{{ messageText }}</p>
      <p class="card-text" v-if="messageAttachment">
        {{ messageAttachment }}
      </p>
    </div>

    <Handle type="target" :position="Position.Top" />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Handle, Position } from "@vue-flow/core";

const { data } = defineProps(["id", "label", "data"]);
const messageText = computed(() => {
  const textPayload = data.payload.find((p) => p.type === "text");
  let text = textPayload?.text ?? "-";

  if (text.length > 50) text = text.slice(0, 30) + "...";

  return text;
});
const messageAttachment = computed(() => {
  const attachmentPayload = data.payload.find((p) => p.type === "attachment");
  let attachment = attachmentPayload?.attachment;

  if (attachment?.length > 50) attachment = attachment.slice(0, 30) + "...";

  return attachment;
});
</script>

<style scoped>
.card {
  max-width: 200px;
}

.card-header {
  background-color: aquamarine;
}
</style>
