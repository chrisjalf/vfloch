<template>
  <div class="card">
    <div class="card-header">
      <i class="bi bi-chat-right-text-fill"></i>
      {{ label }}
    </div>
    <div class="card-body">
      <p class="card-text">{{ formatComment(data.comment ?? "-") }}</p>
    </div>
  </div>
</template>

<script setup>
const { data } = defineProps(["id", "label", "data"]);

function formatComment(comment) {
  if (comment.length > 50) comment = comment.slice(0, 50) + "...";

  return comment;
}
</script>

<style scoped>
.card {
  max-width: 200px;
}

.card-header {
  background-color: cornflowerblue;
}
</style>
