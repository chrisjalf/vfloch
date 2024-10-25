import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

import payload from "../data/payload";

const data = payload;
export const useVueFlowStore = defineStore("vueFlowStore", {
  state: () => ({
    data: data,
    nodes: data.map((p) => {
      const dt = {
        id: `${p.id}`,
        type: p.type,
        label: p.name ?? "N/A",
        data: p.data,
        position: { x: 0, y: 0 },
        deletable: false,
      };

      if (p.parentId) dt.parentId = p.parentId;

      return dt;
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
      newNode.id = uuidv4();
      this.nodes.push(newNode);

      this.addData({
        name: newNode.label,
        id: newNode.id,
        type: newNode.type,
        data: newNode.data,
      });
    },
    updateNode(updatedNode) {
      const index = this.nodes.findIndex((node) => node.id === updatedNode.id);

      if (index > -1) {
        this.nodes[index] = updatedNode;
      }
    },
    updateNodes(nodes) {
      this.nodes = nodes;
    },
    deleteNode(id) {
      this.deleteEdges(id);
      this.nodes = this.nodes.filter((node) => node.id !== id);
    },
    deleteDateTimeNode(id) {
      for (const node of this.nodes) {
        if (node.parentId === id) this.deleteNode(node.id);
      }

      this.deleteNode(id);
    },
    deleteEdges(nodeId) {
      this.edges = this.edges.filter(
        (edge) => edge.source != nodeId && edge.target != nodeId
      );
    },
    addData(newData) {
      this.data.push(newData);
    },
  },
});
