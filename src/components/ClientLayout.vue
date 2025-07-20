<template>
  <div class="client-layout d-flex">
    <!-- ✅ الزر يظهر فقط على الموبايل -->
    <button class="toggle-sidebar-btn d-md-none" @click="sidebarOpen = true">
      ☰
    </button>

    <!-- ✅ الشريط الجانبي -->
    <ClientSidebar :isOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = $event" />

    <!-- ✅ المحتوى -->
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
  margin-right: 220px; /* افتراضياً */
  padding: 20px;
}

@media (max-width: 767px) {
  .main-content {
    margin-right: 0;
  }
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
}
</style>
