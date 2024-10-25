import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

import payload from "../data/payload";

const dataInStorage = localStorage.getItem("vueFlowData") ?? null;
const data = dataInStorage ? JSON.parse(dataInStorage) : payload;
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
    edges: data.reduce((acc, p) => {
      if (p.parentId) {
        acc.push({
          id: `${p.id}_${p.parentId}`,
          source: `${p.parentId}`,
          target: `${p.id}`,
          type: "smoothstep",
        });
      }

      return acc;
    }, []),
  }),
  actions: {
    createNode(newNode) {
      if (newNode.type === "dateTime") {
        this.createDateTimeNode(newNode);
      } else {
        newNode.id = uuidv4();

        this.nodes.push(newNode);
        this.updateData();
      }
    },
    createDateTimeNode(newNode) {
      newNode.id = uuidv4();

      this.nodes.push(newNode);

      for (var i = 0; i < 2; i++) {
        const id = uuidv4();
        const dateTimeConnectorNode = {
          id,
          type: "dateTimeConnector",
          label: i % 2 === 0 ? "Success" : "Failure",
          data: {
            connectorType: i % 2 === 0 ? "success" : "failure",
          },
          position: { x: 0, y: 0 },
          parentId: newNode.id,
        };

        newNode.data.connectors.push(id);
        this.nodes.push(dateTimeConnectorNode);
      }

      this.updateEdges();
      this.updateNode(newNode);
    },
    updateNode(updatedNode) {
      const index = this.nodes.findIndex((node) => node.id === updatedNode.id);

      if (index > -1) {
        this.nodes = this.nodes.map((node) =>
          node.id === updatedNode.id ? { ...updatedNode } : node
        );
        this.updateData();
      }
    },
    updateNodes(nodes) {
      this.nodes = nodes;
      this.updateData();
    },
    deleteNode(id) {
      this.deleteEdges(id);
      this.nodes = this.nodes.filter((node) => node.id !== id);
      this.updateData();
    },
    deleteDateTimeNode(id) {
      for (const node of this.nodes) {
        if (node.parentId === id) this.deleteNode(node.id);
      }

      this.deleteNode(id);
    },
    updateEdges() {
      this.edges = this.nodes.reduce((acc, n) => {
        if (n.parentId) {
          acc.push({
            id: `${n.id}_${n.parentId}`,
            source: `${n.parentId}`,
            target: `${n.id}`,
            type: "smoothstep",
          });
        }

        return acc;
      }, []);
    },
    deleteEdges(nodeId) {
      this.edges = this.edges.filter(
        (edge) => edge.source != nodeId && edge.target != nodeId
      );
    },
    updateData() {
      this.data = this.nodes.map((node) => {
        const dt = {
          name: node.label,
          id: node.id,
          type: node.type,
          data: node.data,
        };

        if (node.parentId) dt.parentId = node.parentId;

        return dt;
      });

      this.updateLocalStorage();
    },
    updateLocalStorage() {
      localStorage.setItem("vueFlowData", JSON.stringify(this.data));
    },
    reset() {
      this.nodes = payload.map((p) => {
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
      });
      this.edges = data.reduce((acc, p) => {
        if (p.parentId) {
          acc.push({
            id: `${p.id}_${p.parentId}`,
            source: `${p.parentId}`,
            target: `${p.id}`,
            type: "smoothstep",
          });
        }

        return acc;
      }, []);
      this.data = payload;
      this.updateLocalStorage();
    },
  },
});
