<script setup>
import { ref, nextTick } from "vue";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { VueFlow } from "@vue-flow/core";

import payload from "../data/payload";

import { useLayout } from "../utils/useLayout";
const { layout } = useLayout();

const nodes = ref(
  payload.map((p) => {
    return {
      id: `${p.id}`,
      label: p.name ?? 'N/A',
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

nextTick(() => {
  nodes.value = layout(nodes.value, edges.value, "TB");
});
</script>

<template>
  <div style="height: 100vh">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      fit-view-on-init
      class="vue-flow-basic-example"
    >
      <Background pattern-color="#aaa" :gap="8" />

      <MiniMap />

      <Controls />
    </VueFlow>
  </div>
</template>
