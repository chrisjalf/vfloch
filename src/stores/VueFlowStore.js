import { defineStore } from "pinia";

import payload from "../data/payload";

const data = payload;
export const useVueFlowStore = defineStore("vueFlowStore", {
  state: () => ({
    data: data,
    nodes: data.map((p) => {
      return {
        id: `${p.id}`,
        type: p.type,
        label: p.name ?? "N/A",
        data: p.data,
        position: { x: 0, y: 0 },
        deletable: false,
      };
    }),
    edges: data.map((p) => {
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
    deleteNode(id) {
      this.nodes.filter((node) => node.id !== id);
    },
  },
});
