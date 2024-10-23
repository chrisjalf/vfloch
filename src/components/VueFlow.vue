<template>
  <VueFlow
    :nodes="nodes"
    :edges="edges"
    ref="vueFlowRef"
    fit-view-on-init
    class="vue-flow"
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
import { VueFlow } from "@vue-flow/core";

import TriggerNode from "./TriggerNode.vue";
import BusinessHoursNode from "./BusinessHoursNode.vue";
import DateTimeConnectorNode from "./DateTimeConnectorNode.vue";
import SendMessageNode from "./SendMessageNode.vue";
import AddCommentNode from "./AddCommentNode.vue";

import { useLayout } from "../utils/useLayout";
import payload from "../data/payload";

const { layout } = useLayout();

const nodes = ref(
  payload.map((p) => {
    return {
      id: `${p.id}`,
      type: p.type,
      label: p.name ?? "N/A",
      data: p.data,
      position: { x: 0, y: 0 },
      deletable: false,
    };
  })
);
const edges = ref(
  payload.map((p) => {
    if (p.parentId) {
      return {
        id: `${p.id}_${p.parentId}`,
        source: `${p.parentId}`,
        target: `${p.id}`,
        type: "smoothstep",
      };
    }
  })
);

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

onMounted(async () => {
  const nodesWithDimension = await measureNodeDimensions();
  nodes.value = layout(nodesWithDimension, edges.value, "TB");
});
</script>

<style lang="scss" scoped>
.vue-flow {
  height: calc(100vh - 110px);
}
</style>
