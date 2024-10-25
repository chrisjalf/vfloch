<template>
  <teleport to="body">
    <div
      className="modal fade"
      tabIndex="{-1}"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref="actionableModal"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {{ title }}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{{ body }}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {{ closeText }}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              @click="handleConfirm"
            >
              {{ confirmText }}
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

defineProps(["title", "body", "closeText", "confirmText"]);
const emit = defineEmits(["confirm"]);

const actionableModal = ref();
let actionableModalObj;

function showModal() {
  actionableModalObj.show();
}

function handleConfirm() {
  emit("confirm");
}

defineExpose({ showModal });

onMounted(() => {
  if (actionableModal.value)
    actionableModalObj = new Modal(actionableModal.value);
});
</script>
