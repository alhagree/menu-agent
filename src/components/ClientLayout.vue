<template>
  <div class="client-layout d-flex flex-column">
    <!-- ✅ الشريط العلوي ثابت -->
    <ClientTopbar class="topbar-fixed" @toggle-sidebar="toggleSidebar" />

    <div class="layout-body d-flex flex-grow-1">
      <!-- ✅ الشريط الجانبي -->
      <ClientSidebar
        class="sidebar-fixed"
        :class="sidebarOpen ? '' : 'sidebar-hidden'"
        :isOpen="sidebarOpen"
        @toggle-sidebar="toggleSidebar"
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
      sidebarOpen: window.innerWidth >= 960,
    };
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    handleResize() {
      if (window.innerWidth >= 960 && !this.sidebarOpen) {
        this.sidebarOpen = true;
      }
    },
  },
};
</script>

<style scoped>
:root {
  --sidebar-width: 220px;
}

.client-layout {
  min-height: 100vh;
  position: relative;
  direction: rtl;
}

/* ✅ الشريط الجانبي */
.sidebar-fixed {
  position: fixed;
  top: 60px;
  right: 0;
  width: var(--sidebar-width);
  height: calc(100vh - 110px);
  background-color: #212529;
  z-index: 1045;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.sidebar-hidden {
  transform: translateX(100%);
}

/* ✅ الجسم الرئيسي */
.layout-body {
  flex-grow: 1;
  display: flex;
  margin-top: 60px;
  margin-bottom: 50px;
}

/* ✅ محتوى الصفحة */
.main-content {
  padding: 20px;
  margin-right: var(--sidebar-width);
  width: 100%;
  transition: margin 0.3s ease;
}

/* ✅ topbar */
.topbar-fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  z-index: 1050;
  background-color: white;
  border-bottom: 1px solid #ddd;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

/* ✅ footer */
.footer-fixed {
  position: fixed;
  bottom: 0;
  right: 0;
  left: var(--sidebar-width);
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

/* ✅ للموبايل */
@media (max-width: 960px) {
  .main-content {
    margin-right: 0;
  }

  .topbar-fixed,
  .footer-fixed {
    left: 0;
  }

  .sidebar-fixed {
    width: 100%;
    right: 0;
    top: 60px;
    height: calc(100vh - 110px);
  }
}
</style>
