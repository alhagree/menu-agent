<template>
  <nav
    class="navbar navbar-light px-4 d-flex justify-content-between align-items-center"
  >
    <!-- ⬅️ يسار: الأزرار -->
    <div class="d-flex gap-2 align-items-center">
      <button class="btn btn-outline-secondary btn-sm" @click="goToMenu">
        <span>عرض المنيو الخاص بك</span>
        <i class="bi bi-box-arrow-up-right ms-2"></i>
      </button>
      <button class="btn btn-outline-danger btn-sm" @click="logout">
        <span>تسجيل الخروج</span>
        <i class="bi bi-box-arrow-right ms-2"></i>
      </button>
    </div>

    <!-- ⬅️ الوسط: العنوان -->
    <div class="text-center fw-bold topbar-title">
      <span>{{ welcomeMessage }}</span>
    </div>

    <!-- ⬅️ اليمين: فراغ للموازنة -->
    <div class="d-none d-md-block" style="width: 200px"></div>
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

<style scoped>
.topbar-title {
  font-size: 1.1rem;
}
.navbar {
  background: linear-gradient(to left, #fdfdfd, #f5f5f5);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  z-index: 1020;
  position: relative;
  border-bottom: 1px solid #ddd;
}
.btn-outline-secondary:hover,
.btn-outline-danger:hover {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease-in-out;
}
</style>
