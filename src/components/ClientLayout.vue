//ClientLayout.vue
<template>
  <div class="client-layout d-flex flex-column">
    <!-- ✅ الشريط العلوي ثابت -->
    <ClientTopbar class="topbar-fixed" />

    <div class="layout-body d-flex flex-grow-1">
      <!-- ✅ زر الفتح يظهر فقط في الشاشات الصغيرة -->
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

      <!-- ✅ المحتوى -->
      <main class="main-content flex-grow-1">
        <router-view />
      </main>
    </div>

    <!-- ✅ الفوتر الثابت -->
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

/* ✅ إلغاء الهامش في الشاشات الصغيرة */
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

/* ✅ topbar ثابت */
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

/* ✅ footer ثابت */
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
</style>
