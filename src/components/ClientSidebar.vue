<!-- ✅ ClientSidebar.vue -->
<template>
  <div :class="['sidebar', sidebarClass]">
    <button class="btn-close d-md-none" @click="closeSidebar">×</button>
    <h5 style="color: azure" class="mb-4">لوحة العميل</h5>
    <ul class="nav flex-column">
      <li class="nav-item mb-2" v-for="link in links" :key="link.name">
        <router-link
          :to="link.to"
          class="nav-link text-white"
          @click="closeSidebar"
        >
          <i :class="link.icon"></i> {{ link.name }}
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
