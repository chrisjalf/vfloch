<template>
  <teleport to="body">
    <div
      className="modal fade"
      tabIndex="{-1}"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref="createNodeModal"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Create Node
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input type="text" class="form-control" v-model="nodeTitle" />
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea
                class="form-control"
                v-model="nodeDescription"
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Type</label>
              <div class="dropdown">
                <button
                  class="btn dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ selectedNode ? selectedNode.name : "Select node type" }}
                </button>
                <ul class="dropdown-menu">
                  <li v-for="(node, index) in nodeTypes" :key="index">
                    <a
                      class="dropdown-item"
                      @click.prevent="changeSelectedNode(node)"
                    >
                      {{ node.name }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Create
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";

const createNodeModal = ref();
let createNodeModalObj;

const nodeTypes = [
  {
    name: "Send Message",
    val: "sendMessage",
  },
  {
    name: "Add Comments",
    val: "addComment",
  },
  {
    name: "Business Hours",
    val: "businessHours",
  },
];

const nodeTitle = ref();
const nodeDescription = ref();
const selectedNode = ref();

function changeSelectedNode(node) {
  selectedNode.value = node;
}

function modalHidden() {
  nodeTitle.value = null;
  nodeDescription.value = null;
  selectedNode.value = null;
}

function showModal() {
  createNodeModalObj.show();
}

defineExpose({ showModal });

onMounted(() => {
  if (createNodeModal.value) {
    createNodeModalObj = new Modal(createNodeModal.value);
    createNodeModal.value.addEventListener("hidden.bs.modal", modalHidden);
  }
});
</script>

<style lang="scss" scoped>
.dropdown-toggle {
  color: var(--bs-btn-active-color);
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);
}
</style>
