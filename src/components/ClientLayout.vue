// ClientLayout.vue
<template>
  <div class="client-layout d-flex flex-column">
    <!-- ✅ الشريط العلوي ثابت -->
    <ClientTopbar
      class="topbar-fixed"
      :class="{ 'with-sidebar': sidebarOpen && screenWidth >= 960 }"
      @toggle-sidebar="toggleSidebar"
    />

    <ClientFooter
      class="footer-fixed"
      :class="{ 'with-sidebar': sidebarOpen && screenWidth >= 960 }"
    />

    <div class="layout-body d-flex flex-grow-1">
      <!-- ✅ الشريط الجانبي -->
      <ClientSidebar
        class="sidebar-fixed"
        :class="sidebarOpen ? '' : 'sidebar-hidden'"
        :isOpen="sidebarOpen"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- ✅ المحتوى -->
      <main
        class="main-content"
        :class="{ 'with-sidebar': sidebarOpen && screenWidth >= 960 }"
      >
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
      screenWidth: window.innerWidth,
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
      this.screenWidth = window.innerWidth;
      if (this.screenWidth >= 960 && !this.sidebarOpen) {
        this.sidebarOpen = true;
      }
      if (this.screenWidth < 960 && this.sidebarOpen) {
        this.sidebarOpen = false;
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
  width: 100%;
  transition: margin 0.3s ease;
}
.main-content.with-sidebar {
  margin-right: var(--sidebar-width);
}

/* ✅ topbar */
.topbar-fixed {
  position: fixed;
  top: 0;
  right: 0;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 10px;
  z-index: 1050;
  left: 0;
  transition: left 0.3s ease;
}
.topbar-fixed.with-sidebar {
  left: var(--sidebar-width);
}
/* ✅ footer */
.footer-fixed {
  position: fixed;
  bottom: 0;
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
  left: 0;
  transition: left 0.3s ease;
}

.footer-fixed.with-sidebar {
  left: var(--sidebar-width);
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
