// ✅ ClientSidebar.vue
<template>
  <div :class="['sidebar', sidebarClass]">
    <button class="btn-close d-md-none" @click="closeSidebar">×</button>

    <h5 class="sidebar-title">لوحة العميل</h5>
    <ul class="nav flex-column">
      <li class="nav-item" v-for="link in links" :key="link.name">
        <router-link
          :to="link.to"
          class="nav-link"
          active-class="active-link"
          exact
          @click="closeSidebar"
        >
          <i :class="link.icon"></i>
          <span class="ms-2">{{ link.name }}</span>
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
      if (this.screenWidth >= 960) return "sidebar-visible";
      return this.isOpen ? "sidebar-visible" : "sidebar-hidden";
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
        this.$emit("toggle-sidebar");
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
  width: var(--sidebar-width);
  height: 100%;
  transition: transform 0.3s ease;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 60px;
  height: calc(100vh - 110px);
  z-index: 1045;
}

.sidebar-visible {
  transform: translateX(0);
}

.sidebar-hidden {
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

.sidebar-title {
  color: #e9ecef;
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.nav-link {
  color: #dee2e6;
  font-weight: 500;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: #495057;
  color: #fff;
  transform: scale(1.03);
}

.active-link {
  background-color: #0d6efd;
  color: white !important;
  font-weight: bold;
}
</style>
