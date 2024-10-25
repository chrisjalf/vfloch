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
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Offcanvas } from "bootstrap";

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

function changeSelectedNode(node) {
  selectedNode.value = node;
}

function showDrawer(node) {
  changeSelectedNode(node);
  nodeDrawerObj.show();
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
