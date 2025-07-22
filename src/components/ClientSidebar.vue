<!-- ClientSidebar.vue -->
<template>
  <div
    class="sidebar"
    :class="{
      'sidebar-open': isOpen,
      'sidebar-closed': !isOpen && isSmallScreen,
    }"
  >
    <!-- زر إغلاق للهواتف -->
    <button
      v-if="isSmallScreen"
      class="btn-close"
      @click="$emit('toggle-sidebar', false)"
    >
      ×
    </button>

    <ul class="nav flex-column gap-3">
      <li class="nav-item">
        <router-link class="nav-link" to="/client/dashboard">
          <i class="bi bi-house-door me-2"></i> الرئيسية
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/client/sections">
          <i class="bi bi-folder me-2"></i> الأقسام
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/client/items">
          <i class="bi bi-basket me-2"></i> الأصناف
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/client/subscription">
          <i class="bi bi-info-circle me-2"></i> تفاصيل الاشتراك
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/client/settings">
          <i class="bi bi-gear me-2"></i> الإعدادات
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/client/about">
          <i class="bi bi-question-circle me-2"></i> حول
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
    isSmallScreen() {
      return window.innerWidth <= 960;
    },
  },
};
</script>
