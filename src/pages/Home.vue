<template>
  <div class="container my-3">
    <div class="row">
      <div class="col-lg-12 mb-3">
        <div class="d-flex justify-content-end">
          <button
            class="btn btn-primary"
            type="button"
            @click="showCreateNodeModal"
          >
            Create Node
          </button>
        </div>
      </div>
      <div class="col-lg-12">
        <VueFlow />
      </div>
    </div>
  </div>

  <CreateNodeModal ref="createNodeModal" />
</template>

<script setup>
import { ref } from "vue";

import VueFlow from "../components/VueFlow.vue";
import CreateNodeModal from "../components/CreateNodeModal.vue";

const createNodeModal = ref();

function showCreateNodeModal() {
  createNodeModal.value?.showModal();
}
</script>
