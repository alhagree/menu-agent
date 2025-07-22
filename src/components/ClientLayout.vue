<template>
  <div class="client-layout d-flex flex-column">
    <!-- ✅ الشريط العلوي ثابت -->
    <ClientTopbar class="topbar-fixed" />

    <div class="layout-body d-flex flex-grow-1">
      <!-- ✅ الشريط الجانبي الثابت -->
      <ClientSidebar
        class="sidebar-fixed"
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
:root {
  --sidebar-width: 220px;
}

.client-layout {
  min-height: 100vh;
  position: relative;
}

/* ✅ الشريط الجانبي */
.sidebar-fixed {
  position: fixed;
  top: 60px; /* بعد التوب بار */
  right: 0;
  width: var(--sidebar-width);
  height: calc(100vh - 110px); /* استثناء التوب والفوتر */
  background-color: #212529;
  z-index: 1045;
  overflow-y: auto;
}

/* ✅ الجسم الرئيسي */
.layout-body {
  flex-grow: 1;
  display: flex;
  margin-top: 60px; /* ارتفاع التوب بار */
  margin-bottom: 50px; /* ارتفاع الفوتر */
}

/* ✅ محتوى الصفحة */
.main-content {
  padding: 20px;
  margin-right: var(--sidebar-width); /* حجز مساحة للسايد بار */
  width: 100%;
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

/* ✅ للموبايل: نلغي المساحات ونعرض السايد بار فوق */
@media (max-width: 960px) {
  .main-content {
    margin-right: 0;
  }

  .topbar-fixed,
  .footer-fixed {
    left: 0;
  }

  .sidebar-fixed {
    position: fixed;
    top: 60px; 
    right: 0;
    width: 100%;
    height: calc(100vh - 110px);
    z-index: 1050;
  }
}
</style>
