<template>
  <div class="sidebar">
    <h5 class="mb-4">لوحة العميل</h5>
    <ul class="nav flex-column">
      <li class="nav-item mb-2" v-for="link in links" :key="link.name">
        <router-link :to="link.to" class="nav-link text-white">
          <i :class="link.icon"></i> {{ link.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ClientSidebar",
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
