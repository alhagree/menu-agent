<!-- src/components/base/AppToast.vue -->
<template>
  <div
    class="toast align-items-center text-white"
    :class="`bg-${toastType}`"
    role="alert"
    ref="toast"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">
        {{ toastMessage }}
      </div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script>
// ✅ استيراد Toast من bootstrap
import { Toast } from "bootstrap";

export default {
  name: "AppToast",
  data() {
    return {
      toastMessage: "",
      toastType: "success", // success, danger, warning, etc.
    };
  },
  methods: {
    show(message, type = "success") {
      this.toastMessage = message;
      this.toastType = type;

      // عرض التوست بعد التحديث
      this.$nextTick(() => {
        const toastEl = this.$refs.toast;
        const toast = new Toast(toastEl);
        toast.show();
      });
    },
  },
};
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  min-width: 250px;
}
</style>
