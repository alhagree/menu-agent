<!-- ClientTopbar.vue -->
<template>
  <nav class="navbar d-flex justify-content-between align-items-center">
    <!-- ✅ الرسالة الترحيبية (تُخفى في الموبايل) -->
    <div
      class="flex-grow-1 text-center fw-bold topbar-title d-none d-md-flex justify-content-center align-items-center gap-2"
    >
      <img
        src="https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/logo.png"
        alt="Logo"
        class="logo-icon"
      />
      <span>{{ welcomeMessage }}</span>
    </div>

    <!-- ✅ الأزرار: عرض المنيو وتسجيل الخروج -->
    <div class="d-flex gap-2 align-items-center">
      <button
        class="btn btn-outline-secondary btn-sm d-flex align-items-center"
        @click="goToMenu"
      >
        <i class="bi bi-box-arrow-up-right ms-2"></i>
        <span>عرض المنيو الخاص بك</span>
      </button>
      <button
        class="btn btn-outline-danger btn-sm d-flex align-items-center"
        @click="logout"
      >
        <i class="bi bi-box-arrow-right ms-2"></i>
        <span>تسجيل الخروج</span>
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
      this.welcomeMessage = `👋 أهلاً بك من جديد يا ${name}`;
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
