<!-- ClientLayout.vue -->
<template>
  <div class="client-layout d-flex flex-column">
    <!-- ✅ الشريط العلوي -->
    <ClientTopbar class="topbar-fixed" />

    <div class="layout-body d-flex flex-grow-1">
      <!-- ✅ زر فتح الشريط الجانبي للشاشات الصغيرة -->
      <button
        class="toggle-sidebar-btn d-lg-none"
        @click="sidebarOpen = !sidebarOpen"
      >
        ☰
      </button>

      <!-- ✅ الشريط الجانبي -->
      <ClientSidebar
        :isOpen="sidebarOpen"
        @toggle-sidebar="sidebarOpen = $event"
      />

      <!-- ✅ محتوى الصفحة -->
      <main class="main-content flex-grow-1">
        <router-view />
      </main>
    </div>

    <!-- ✅ الفوتر -->
    <ClientFooter class="footer-fixed" />
  </div>
</template>

<script>
import ClientSidebar from "./ClientSidebar.vue";
import ClientTopbar from "./ClientTopbar.vue";
import ClientFooter from "./ClientFooter.vue";

export default {
  name: "ClientLayout",
  components: { ClientSidebar, ClientTopbar, ClientFooter },
  data() {
    return {
      sidebarOpen: false,
    };
  },
};
</script>

<style scoped>
.client-layout {
  min-height: 100vh;
  position: relative;
}

.layout-body {
  flex-grow: 1;
  display: flex;
  margin-top: 60px; /* ارتفاع التوب بار */
  margin-bottom: 50px; /* ارتفاع الفوتر */
}

.main-content {
  padding: 20px;
  margin-right: 220px;
  width: 100%;
}

@media (max-width: 960px) {
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

.topbar-fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1050;
  background-color: white;
  border-bottom: 1px solid #ddd;
  height: 60px;
}

.footer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #555;
  z-index: 1040;
}

/* الشريط الجانبي */
.sidebar {
  background-color: #212529;
  color: white;
  padding: 20px;
  width: 220px;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1050;
  transition: transform 0.3s ease;
}
.sidebar-open {
  transform: translateX(0);
}
.sidebar-closed {
  transform: translateX(100%);
}
.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: block;
}
.nav-link {
  color: white;
  font-weight: 500;
}
.nav-link:hover,
.router-link-exact-active {
  color: #0d6efd;
}

/* التوب بار */
.navbar {
  background: linear-gradient(to left, #fdfdfd, #f5f5f5);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #ddd;
  min-height: 60px;
  padding: 0 1.5rem;
}
.topbar-title {
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
}
.logo-icon {
  height: 28px;
  object-fit: contain;
  filter: grayscale(20%) brightness(1.2);
}
.btn-outline-secondary:hover,
.btn-outline-danger:hover {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease-in-out;
}
</style>