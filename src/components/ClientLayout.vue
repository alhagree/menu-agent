<template>
  <div class="client-layout d-flex">
    <!-- زر فتح الشريط الجانبي -->
    <button class="toggle-sidebar-btn" @click="sidebarOpen = true">☰</button>

    <!-- الشريط الجانبي -->
    <ClientSidebar :isOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = $event" />

    <!-- المحتوى الرئيسي -->
    <main class="main-content flex-grow-1">
      <ClientTopbar />
      <router-view />
    </main>
  </div>
</template>

<script>
import ClientSidebar from "./ClientSidebar.vue";
import ClientTopbar from "./ClientTopbar.vue";

export default {
  name: "ClientLayout",
  components: { ClientSidebar, ClientTopbar },
  data() {
    return {
      sidebarOpen: false,
    };
  },
};
</script>

<style scoped>
.client-layout {
  position: relative;
}

.main-content {
  padding: 20px;
}

/* زر فتح القائمة */
.toggle-sidebar-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  background: #0d6efd;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 1.2rem;
  z-index: 1100;
  border-radius: 5px;
}
</style>
