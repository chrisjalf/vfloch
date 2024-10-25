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

      const newData = {
        name: newNode.label,
        id: newNode.id,
        type: newNode.type,
        data: newNode.data,
      };
      this.data.push(newData);

      /* const nodeType = newNode.type;
      switch (nodeType) {
        case "sendMessage":
          break;
        case "dateTime":
          break;
        case "addComment":
          break;
        default:
          break;
      } */
    },
    updateNodes(nodes) {
      this.nodes = nodes;
    },
    deleteNode(id) {
      deleteEdges(id);
      this.nodes = this.nodes.filter((node) => node.id !== id);
    },
    deleteEdges(nodeId) {
      this.edges = this.edges.filter(
        (edge) => edge.source != nodeId && edge.target != nodeId
      );
    },
  },
});
