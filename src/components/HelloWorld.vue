<template>
  <div style="height: 100vh">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      fit-view-on-init
      class="vue-flow-basic-example"
    >
      <template #node-sendMessage="sendMessageNodeProps">
        <SendMessageNode v-bind="sendMessageNodeProps" />
      </template>

      <template #node-dateTimeConnector="dateTimeConnectorNodeProps">
        <DateTimeConnectorNode v-bind="dateTimeConnectorNodeProps" />
      </template>

      <template #node-addComment="addCommentNodeProps">
        <AddCommentNode v-bind="addCommentNodeProps" />
      </template>

      <Background pattern-color="#aaa" :gap="8" />

      <MiniMap />

      <Controls />
    </VueFlow>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { VueFlow } from "@vue-flow/core";

import SendMessageNode from "./SendMessageNode.vue";
import AddCommentNode from "./AddCommentNode.vue";
import DateTimeConnectorNode from "./DateTimeConnectorNode.vue";

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

onMounted(() => {
  nodes.value = layout(nodes.value, edges.value, "TB");
});
</script>

<style></style>
