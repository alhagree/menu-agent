<template>
  <div :class="['sidebar', sidebarClass]">
    <!-- ✅ زر الإغلاق يظهر فقط في الشاشات الصغيرة -->
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
  computed: {
    sidebarClass() {
      // ✅ دائمًا ظاهر على الشاشات الكبيرة
      if (window.innerWidth >= 960) return "sidebar-open";
      return this.isOpen ? "sidebar-open" : "sidebar-closed";
    },
  },
  methods: {
    closeSidebar() {
      // ✅ فقط على الموبايل يتم الإغلاق
      if (window.innerWidth < 960) {
        this.$emit("toggle-sidebar", false);
      }
    },
  },
  data() {
    return {
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
</style>
