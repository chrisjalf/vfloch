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

import { useLayout } from "../utils/useLayout";
import { useVueFlowStore } from "../stores/VueFlowStore";

const { onNodeDragStop } = useVueFlow();
const { layout } = useLayout();
const vueFlowStore = useVueFlowStore();
const { nodes, edges } = storeToRefs(vueFlowStore);
const vueFlowRef = ref(null);

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

onNodeDragStop((event) => {
  // update node state to set new position after dragging stops
  const nodeId = event.node.id;
  const draggedNode = nodes.value.find((n) => n.id === nodeId);

  if (draggedNode) {
    draggedNode.position = event.node.position;
    vueFlowStore.updateNode(draggedNode);
  }
});

onMounted(async () => {
  const nodesWithDimension = await measureNodeDimensions();
  vueFlowStore.updateNodes(layout(nodesWithDimension, edges.value, "TB"));
});
</script>

<style lang="scss" scoped>
.vue-flow {
  height: calc(75vh);
}
</style>
