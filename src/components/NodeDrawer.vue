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
        <div class="mb-3" v-if="nodeFields.type === 'sendMessage'">
          <label class="form-label">Message</label>
          <textarea class="form-control" v-model="sendMessageText"></textarea>
        </div>
        <div class="mb-3" v-if="nodeFields.type === 'sendMessage'">
          <label class="form-label">Attachment</label>
          <i
            class="bi bi-x-circle-fill ms-2"
            v-if="sendMessageAttachment"
            @click="removeAttachment"
          ></i>
          <input
            class="form-control mb-2"
            :class="{ 'is-invalid': formError.attachment }"
            type="file"
            ref="attachmentInput"
            @change="validateFileSize"
          />
          <div className="invalid-feedback" v-if="formError.attachment">
            {{ formError.attachment }}
          </div>
          <div class="mt-3 text-break" v-if="sendMessageAttachment">
            {{ sendMessageAttachment }}
          </div>
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
const sendMessageText = ref("");
const attachmentInput = ref();
const sendMessageAttachment = ref();
const formError = ref({});

function changeSelectedNode(node) {
  selectedNode.value = node;

  if (node) {
    switch (node.type) {
      case "sendMessage":
        const textPayload = node.data.payload.find((p) => p.type === "text");
        const attachmentPayload = node.data.payload.find(
          (p) => p.type === "attachment"
        );

        if (textPayload) {
          sendMessageText.value = textPayload.text;
        }

        if (attachmentPayload) {
          sendMessageAttachment.value = attachmentPayload.attachment;
        }

        break;
      default:
        break;
    }

    nodeFields.value = {
      ...node,
      data: { ...node.data, description: node.data?.description ?? "" },
    };
  } else {
    switch (nodeFields.value.type) {
      case "sendMessage":
        sendMessageText.value = "";
        sendMessageAttachment.value = undefined;

        break;
      default:
        break;
    }

    nodeFields.value = node;
  }
}

function validateFileSize(event) {
  const file = event.target.files[0];
  const maxSizeInMB = 2;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file && file.size > maxSizeInBytes) {
    formError.value[
      "attachment"
    ] = `File size should be less than ${maxSizeInMB} MB.`;
  } else {
    delete formError.value["attachment"];
    sendMessageAttachment.value = file.name;
  }
}

function removeAttachment() {
  attachmentInput.value.value = "";
  sendMessageAttachment.value = undefined;
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
    console.log(nodeFields.value.type);
    switch (nodeFields.value.type) {
      case "sendMessage":
        const n = nodeFields.value;
        const payload = [];

        if (sendMessageText.value) {
          payload.push({
            type: "text",
            text: sendMessageText.value,
          });
        }

        if (sendMessageAttachment.value) {
          payload.push({
            type: "attachment",
            attachment: sendMessageAttachment.value,
          });
        }

        nodeFields.value = {
          ...n,
          data: {
            ...n.data,
            payload: payload,
          },
        };

        break;
      default:
        break;
    }

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

.bi-x-circle-fill {
  color: red;
}

.offcanvas-footer {
  padding: var(--bs-offcanvas-padding-y) var(--bs-offcanvas-padding-x);
}
</style>
