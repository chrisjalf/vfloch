<template>
  <VueFlow
    :nodes="nodes"
    :edges="edges"
    ref="vueFlowRef"
    fit-view-on-init
    class="vue-flow border border-dark-subtle rounded"
  >
    <template #node-trigger="triggerNodeProps">
      <TriggerNode v-bind="triggerNodeProps" />
    </template>

    <template #node-dateTime="dateTimeNodeProps">
      <BusinessHoursNode v-bind="dateTimeNodeProps" />
    </template>

    <template #node-dateTimeConnector="dateTimeConnectorNodeProps">
      <DateTimeConnectorNode v-bind="dateTimeConnectorNodeProps" />
    </template>

    <template #node-sendMessage="sendMessageNodeProps">
      <SendMessageNode v-bind="sendMessageNodeProps" />
    </template>

    <template #node-addComment="addCommentNodeProps">
      <AddCommentNode v-bind="addCommentNodeProps" />
    </template>

    <Background pattern-color="#aaa" :gap="8" />

    <MiniMap />

    <Controls />
  </VueFlow>
  <button @click="openCreateNodeModal">Create Node?</button>
  <CreateNodeModal ref="createNodeModal" />
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { storeToRefs } from "pinia";

import TriggerNode from "./TriggerNode.vue";
import BusinessHoursNode from "./BusinessHoursNode.vue";
import DateTimeConnectorNode from "./DateTimeConnectorNode.vue";
import SendMessageNode from "./SendMessageNode.vue";
import AddCommentNode from "./AddCommentNode.vue";
import CreateNodeModal from "./CreateNodeModal.vue";

import { useLayout } from "../utils/useLayout";
import { useVueFlowStore } from "../stores/VueFlowStore";

const { onNodeDragStop } = useVueFlow();
const { layout } = useLayout();
const vueFlowStore = useVueFlowStore();
const { nodes, edges } = storeToRefs(vueFlowStore);
const vueFlowRef = ref(null);
const createNodeModal = ref();

// to measure node dimensions dynamically after rendering
async function measureNodeDimensions() {
  await nextTick(); // ensure DOM is fully updated

  const nodeWithDimensions = nodes.value.map((node) => {
    const element = vueFlowRef.value.$el.querySelector(
      `[data-id="${node.id}"]`
    );

    // element found
    if (element) {
      // get width and height
      const style = window.getComputedStyle(element);
      const width = parseFloat(style.width);
      const height = parseFloat(style.height);

      return {
        ...node,
        dimensions: {
          width,
          height,
        },
      };
    } else {
      return node;
    }
  });

  return nodeWithDimensions;
}

/* OBSERVING */
function deleteNode(id) {
  deleteEdges(id);
  nodes.value = nodes.value.filter((node) => node.id !== id);
}

function deleteEdges(nodeId) {
  edges.value = edges.value.filter(
    (edge) => edge.source != nodeId && edge.target != nodeId
  );
}

function addNode() {
  const node = {
    id: `${Math.random()}`,
    type: "sendMessage",
    label: "Placeholder title",
    data: {
      payload: [
        {
          type: "text",
          text: "Placeholder text",
        },
      ],
    },
    position: { x: 0, y: 0 },
    deletable: false,
  };

  nodes.value = [...nodes.value, node];
}

onNodeDragStop((event) => {
  // update node state to set new position after dragging stops
  const nodeId = event.node.id;
  const idx = nodes.value.findIndex((n) => n.id === nodeId);

  if (idx > -1) {
    nodes.value[idx].position = event.node.position;
  }
});

function openCreateNodeModal() {
  createNodeModal.value?.showModal();
}
/* END OBSERVING */

onMounted(async () => {
  const nodesWithDimension = await measureNodeDimensions();
  vueFlowStore.updateNodes(layout(nodesWithDimension, edges.value, "TB"));
});
</script>

<style lang="scss" scoped>
.vue-flow {
  height: calc(100vh - 110px);
}
</style>
