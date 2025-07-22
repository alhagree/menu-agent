<template>
  <div :class="['sidebar', sidebarClass]">
    <!-- زر الإغلاق للموبايل -->
    <button class="btn-close d-md-none" @click="closeSidebar">×</button>

    <h5 class="sidebar-title">لوحة العميل</h5>
    <ul class="nav flex-column">
      <li class="nav-item" v-for="link in links" :key="link.name">
        <router-link
          :to="link.to"
          class="nav-link text-white"
          active-class="active-link"
          exact
          @click="closeSidebar"
        >
          <i :class="link.icon" class="me-2"></i>
          {{ link.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ClientSidebar",
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      screenWidth: window.innerWidth,
      links: [
        { name: "الرئيسية", to: "/client", icon: "bi bi-house-door" },
        { name: "الأقسام", to: "/client/sections", icon: "bi bi-folder" },
        { name: "الأصناف", to: "/client/items", icon: "bi bi-basket" },
        {
          name: "تفاصيل الاشتراك",
          to: "/client/subscription",
          icon: "bi bi-info-circle",
        },
        { name: "الإعدادات", to: "/client/settings", icon: "bi bi-gear" },
        { name: "حول", to: "/client/about", icon: "bi bi-question-circle" },
      ],
    };
  },
  computed: {
    sidebarClass() {
      if (this.screenWidth >= 960) return "sidebar-open";
      return this.isOpen ? "sidebar-open" : "sidebar-closed";
    },
  },
  mounted() {
    window.addEventListener("resize", this.updateWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  },
  methods: {
    updateWidth() {
      this.screenWidth = window.innerWidth;
    },
    closeSidebar() {
      if (this.screenWidth < 960) {
        this.$emit("toggle-sidebar", false);
      }
    },
  },
};
</script>

<style scoped>
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
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  color: #f1f1f1;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
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
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  color: white;
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #0d6efd;
}

.active-link {
  background-color: #0d6efd;
  color: white !important;
}
</style>
