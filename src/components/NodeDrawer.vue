<template>
  <teleport to="body">
    <div
      class="offcanvas offcanvas-end"
      data-bs-scroll="true"
      tabindex="-1"
      id="offcanvasWithBothOptions"
      aria-labelledby="offcanvasWithBothOptionsLabel"
      ref="nodeDrawer"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">
          <i class="bi" :class="selectedNodeIcon" v-if="selectedNodeIcon"></i>
          {{ selectedNode?.label ?? "Selected Node" }}
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body" v-if="nodeFields">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': formError.title }"
            @focus="validateInput('title')"
            @input="validateInput('title')"
            v-model="nodeFields.label"
          />
          <div className="invalid-feedback" v-if="formError.title">
            {{ formError.title }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea
            class="form-control"
            :class="{ 'is-invalid': formError.description }"
            @focus="validateInput('description')"
            @input="validateInput('description')"
            v-model="nodeFields.data.description"
          ></textarea>
          <div className="invalid-feedback" v-if="formError.description">
            {{ formError.description }}
          </div>
        </div>
        <div class="mb-3" v-if="nodeFields.type === 'addComment'">
          <label class="form-label">Comment</label>
          <textarea
            class="form-control"
            v-model="nodeFields.data.comment"
          ></textarea>
        </div>
      </div>
      <div class="offcanvas-footer">
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-danger me-2"
            @click="promptDeleteNode"
          >
            Delete
          </button>
          <button type="button" class="btn btn-primary" @click="updateNode">
            Update
          </button>
        </div>
      </div>
    </div>
  </teleport>
  <TheActionableModal
    ref="deletionModal"
    :title="'Deleting Node'"
    :body="'This action cannot be undone. Proceed?'"
    :closeText="'Close'"
    :confirmText="'Confirm'"
    @confirm="deleteNode"
  />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Offcanvas } from "bootstrap";

import TheActionableModal from "./TheActionableModal.vue";

import { useVueFlowStore } from "../stores/VueFlowStore";

const vueFlowStore = useVueFlowStore();

const nodeDrawer = ref();
let nodeDrawerObj;
const deletionModal = ref();

const selectedNode = ref();
const selectedNodeIcon = computed(() => {
  let icon;

  if (selectedNode.value?.type) {
    switch (selectedNode.value.type) {
      case "sendMessage":
        icon = "bi-send-fill";
        break;
      case "addComment":
        icon = "bi-chat-right-text-fill";
        break;
      case "dateTime":
        icon = "bi-clock-fill";
        break;
      default:
        break;
    }
  }

  return icon;
});
const nodeFields = ref();
const formError = ref({});

function changeSelectedNode(node) {
  selectedNode.value = node;

  if (node) {
    nodeFields.value = {
      ...node,
      data: { ...node.data, description: node.data?.description ?? "" },
    };
  } else nodeFields.value = node;
}

function validateInput(fieldName) {
  let errorMessage = undefined;

  switch (fieldName) {
    case "title":
      const nodeTitle = nodeFields.value.label ?? "";
      if (nodeTitle.trim() === "") errorMessage = "Title is required";

      break;
    case "description":
      const nodeDescription = nodeFields.value.data.description ?? "";
      if (nodeDescription.trim() === "")
        errorMessage = "Description is required";

      break;
    default:
      break;
  }

  if (errorMessage === undefined) {
    delete formError.value[fieldName];
  } else formError.value[fieldName] = errorMessage;
}

function checkFields() {
  const nodeTitle = nodeFields.value.label ?? "";
  const nodeDescription = nodeFields.value.data.description ?? "";
  formError.value = {};

  if (nodeTitle.trim() === "") formError.value["title"] = "Title is required";

  if (nodeDescription.trim() === "")
    formError.value["description"] = "Description is required";
}

function updateNode() {
  checkFields();

  if (Object.keys(formError.value).length === 0) {
    hideDrawer();
    vueFlowStore.updateNode(nodeFields.value);
  }
}

function promptDeleteNode() {
  deletionModal.value?.showModal();
}

function deleteNode() {
  const node = selectedNode.value;
  const nodeId = node.id;
  hideDrawer();

  if (node.type === "dateTime") vueFlowStore.deleteDateTimeNode(nodeId);
  else vueFlowStore.deleteNode(nodeId);
}

function resetForm() {
  changeSelectedNode(undefined);
  formError.value = {};
}

function showDrawer(node) {
  changeSelectedNode(node);
  nodeDrawerObj.show();
}

function hideDrawer() {
  nodeDrawerObj.hide();
}

defineExpose({ showDrawer });

onMounted(() => {
  if (nodeDrawer.value) {
    nodeDrawerObj = new Offcanvas(nodeDrawer.value);
    nodeDrawer.value.addEventListener("hidden.bs.offcanvas", resetForm);
  }
});

onBeforeUnmount(() => {
  if (nodeDrawer.value) {
    nodeDrawer.value.removeEventListener("hidden.bs.offcanvas", resetForm);
  }
});
</script>

<style lang="scss" scoped>
.bi-send-fill {
  color: aquamarine;
}

.bi-chat-right-text-fill {
  color: cornflowerblue;
}

.bi-clock-fill {
  color: orange;
}

.offcanvas-footer {
  padding: var(--bs-offcanvas-padding-y) var(--bs-offcanvas-padding-x);
}
</style>
