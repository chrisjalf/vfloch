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
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': formError.title }"
                @focus="validateInput('title')"
                @input="validateInput('title')"
                v-model="nodeTitle"
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
                v-model="nodeDescription"
              ></textarea>
              <div className="invalid-feedback" v-if="formError.description">
                {{ formError.description }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Type</label>
              <div class="dropdown">
                <button
                  class="btn dropdown-toggle"
                  :class="{
                    'is-invalid': formError.nodeType,
                    show: showDropdownMenu,
                  }"
                  type="button"
                  aria-expanded="false"
                  ref="dropdownButton"
                  @click="toggleDropdown"
                >
                  {{ selectedNode ? selectedNode.name : "Select node type" }}
                </button>
                <ul class="dropdown-menu" ref="dropdownMenu">
                  <li v-for="(node, index) in nodeTypes" :key="index">
                    <a
                      class="dropdown-item"
                      :class="{
                        active: selectedNode
                          ? selectedNode.val === node.val
                          : false,
                      }"
                      @click.prevent="changeSelectedNode(node)"
                    >
                      {{ node.name }}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="invalid-feedback" v-if="formError.nodeType">
                {{ formError.nodeType }}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              @click="submitForm"
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Modal, Dropdown } from "bootstrap";

import { useVueFlowStore } from "../stores/VueFlowStore";

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

const createNodeModal = ref();
let createNodeModalObj;

const dropdownButton = ref();
const dropdownMenu = ref();
let dropdownObj;
const showDropdownMenu = ref(false);

const nodeTitle = ref("");
const nodeDescription = ref("");
const selectedNode = ref();
const formError = ref({});

const vueFlowStore = useVueFlowStore();

function changeSelectedNode(node) {
  selectedNode.value = node;
  showDropdownMenu.value = false;
  dropdownObj.hide();

  validateInput("nodeType");
}

function validateInput(fieldName) {
  let errorMessage = undefined;

  switch (fieldName) {
    case "title":
      if (nodeTitle.value.trim() === "") errorMessage = "Title is required";

      break;
    case "description":
      if (nodeDescription.value.trim() === "")
        errorMessage = "Description is required";

      break;
    case "nodeType":
      if (selectedNode.value === undefined)
        errorMessage = "Node type is required";

      break;
    default:
      break;
  }

  if (errorMessage === undefined) {
    delete formError.value[fieldName];
  } else formError.value[fieldName] = errorMessage;
}

function checkFields() {
  formError.value = {};

  if (nodeTitle.value.trim() === "")
    formError.value["title"] = "Title is required";

  if (nodeDescription.value.trim() === "")
    formError.value["description"] = "Description is required";

  if (selectedNode.value === undefined)
    formError.value["nodeType"] = "Node type is required";
}

function toggleDropdown() {
  showDropdownMenu.value = !showDropdownMenu.value;

  validateInput("nodeType");

  if (showDropdownMenu.value === true) dropdownObj.show();
  else dropdownObj.hide();
}

function handleClickOutsideForDropdown(event) {
  if (
    dropdownMenu.value &&
    !dropdownMenu.value.contains(event.target) &&
    !dropdownButton.value.contains(event.target)
  ) {
    showDropdownMenu.value = false;
    dropdownObj.hide();
  }
}

function resetForm() {
  nodeTitle.value = "";
  nodeDescription.value = "";
  selectedNode.value = undefined;
  formError.value = {};
}

function submitForm() {
  checkFields();

  if (Object.keys(formError.value).length === 0) {
    const node = {
      id: `${Math.random()}`,
      type: selectedNode.value.val,
      label: nodeTitle.value,
      data: {
        description: nodeTitle.description,
      },
      position: { x: 0, y: 0 },
      deletable: false,
    };

    switch (selectedNode.value.val) {
      case "businessHours":
        node.type = "dateTime";
        node.data.times = [];
        node.data.connectors = [];
        node.data.timezone = "UTC";
        node.data.action = selectedNode.value.val;

        break;
      case "sendMessage":
        node.data.payload = [];

        break;
      case "addComment":
        break;
      default:
        break;
    }

    vueFlowStore.createNode(node);
    hideModal();
  }
}

function showModal() {
  createNodeModalObj.show();
}

function hideModal() {
  createNodeModalObj.hide();
}

defineExpose({ showModal });

onMounted(() => {
  if (createNodeModal.value) {
    createNodeModalObj = new Modal(createNodeModal.value);
    createNodeModal.value.addEventListener("hidden.bs.modal", resetForm);
  }

  if (dropdownButton.value) {
    dropdownObj = new Dropdown(dropdownButton.value);
    document.addEventListener("mousedown", handleClickOutsideForDropdown);
  }
});

onBeforeUnmount(() => {
  if (createNodeModal.value) {
    createNodeModal.value.removeEventListener("hidden.bs.modal", resetForm);
  }

  document.removeEventListener("mousedown", handleClickOutsideForDropdown);
});
</script>

<style lang="scss" scoped>
.dropdown {
  &:has(.is-invalid) + .invalid-feedback {
    display: block;
  }
}

.dropdown-toggle {
  color: var(--bs-btn-active-color);
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);

  &.is-invalid {
    border-color: var(--bs-form-invalid-border-color);
  }
}
</style>
