<template>
  <teleport to="body">
    <div
      class="offcanvas offcanvas-end"
      data-bs-scroll="true"
      tabindex="-1"
      id="offcanvasWithBothOptions"
      aria-labelledby="offcanvasWithBothOptionsLabel"
      ref="nodeDrawer"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">
          <i class="bi" :class="selectedNodeIcon" v-if="selectedNodeIcon"></i>
          {{ selectedNode?.label ?? "Selected Node" }}
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <p>Try scrolling the rest of the page to see this option in action.</p>
        <button type="button" class="btn btn-danger" @click="promptDeleteNode">
          Delete
        </button>
      </div>
    </div>
  </teleport>
  <TheActionableModal
    ref="deletionModal"
    :title="'Deleting Node'"
    :body="'This action cannot be undone. Proceed?'"
    :closeText="'Close'"
    :confirmText="'Confirm'"
    @confirm="deleteNode"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Offcanvas } from "bootstrap";

import TheActionableModal from "./TheActionableModal.vue";

import { useVueFlowStore } from "../stores/VueFlowStore";

const vueFlowStore = useVueFlowStore();

const selectedNode = ref();
const selectedNodeIcon = computed(() => {
  let icon;

  if (selectedNode.value?.type) {
    switch (selectedNode.value.type) {
      case "sendMessage":
        icon = "bi-send-fill";
        break;
      case "addComment":
        icon = "bi-chat-right-text-fill";
        break;
      case "dateTime":
        icon = "bi-clock-fill";
        break;
      default:
        break;
    }
  }

  return icon;
});
const nodeDrawer = ref();
let nodeDrawerObj;
const deletionModal = ref();

function changeSelectedNode(node) {
  selectedNode.value = node;
}

function promptDeleteNode() {
  deletionModal.value?.showModal();
}

function deleteNode() {
  const node = selectedNode.value;
  const nodeId = node.id;
  hideDrawer();

  if (node.type === "dateTime") vueFlowStore.deleteDateTimeNode(nodeId);
  else vueFlowStore.deleteNode(nodeId);
}

function showDrawer(node) {
  changeSelectedNode(node);
  nodeDrawerObj.show();
}

function hideDrawer() {
  changeSelectedNode(undefined);
  nodeDrawerObj.hide();
}

defineExpose({ showDrawer });

onMounted(() => {
  if (nodeDrawer.value) {
    nodeDrawerObj = new Offcanvas(nodeDrawer.value);
  }
});
</script>

<style lang="scss" scoped>
.bi-send-fill {
  color: aquamarine;
}

.bi-chat-right-text-fill {
  color: cornflowerblue;
}

.bi-clock-fill {
  color: orange;
}
</style>
