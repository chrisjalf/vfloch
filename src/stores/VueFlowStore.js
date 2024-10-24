import { defineStore } from "pinia";

import payload from "../data/payload";

export const useVueFlowStore = defineStore("vueFlowStore", {
  state: () => ({
    data: payload,
    nodes: payload.map((p) => {
      return {
        id: `${p.id}`,
        type: p.type,
        label: p.name ?? "N/A",
        data: p.data,
        position: { x: 0, y: 0 },
        deletable: false,
      };
    }),
    edges: payload.map((p) => {
      if (p.parentId) {
        return {
          id: `${p.id}_${p.parentId}`,
          source: `${p.parentId}`,
          target: `${p.id}`,
          type: "smoothstep",
        };
      }
    }),
  }),
  actions: {
    createNode(newNode) {
      this.nodes.push(newNode);
    },
    updateNodes(nodes) {
      this.nodes = nodes;
    },
  },
});
