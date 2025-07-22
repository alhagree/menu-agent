<!-- ✅ ClientTopbar.vue -->
<template>
  <nav
    class="navbar navbar-light px-4 d-flex justify-content-between align-items-center flex-wrap"
  >
    <!-- الشعار + العنوان -->
    <div
      class="topbar-title d-flex align-items-center gap-2 mx-auto d-none d-md-flex"
    >
      <img
        src="https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/logo.png"
        alt="Logo"
        class="logo-icon"
      />
      <span>{{ welcomeMessage }}</span>
    </div>

    <!-- الأزرار -->
    <div class="d-flex gap-2 align-items-center ms-auto me-auto me-md-0">
      <button
        class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
        @click="goToMenu"
      >
        <span>عرض المنيو الخاص بك</span>
        <i class="bi bi-box-arrow-up-right"></i>
      </button>

      <button
        class="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
        @click="logout"
      >
        <span>تسجيل الخروج</span>
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "ClientTopbar",
  data() {
    return {
      welcomeMessage: "👋 أهلاً بك من جديد",
    };
  },
  mounted() {
    const name = localStorage.getItem("client_name");
    if (name) {
      this.welcomeMessage = `👋 أهلاً ${name}`;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("client_token");
      localStorage.removeItem("client_link_code");
      localStorage.removeItem("client_name");
      this.$router.push("/client/login");
    },
    goToMenu() {
      const linkCode = localStorage.getItem("client_link_code");
      if (linkCode) {
        const menuUrl = `https://menu.tiklamu.com/?link_code=${linkCode}`;
        window.open(menuUrl, "_blank");
      } else {
        alert("رمز المنيو غير متوفر.");
      }
    },
  },
};
</script>
