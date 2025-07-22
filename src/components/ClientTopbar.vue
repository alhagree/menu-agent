<template>
  <nav
    class="navbar navbar-light px-4 d-flex justify-content-between align-items-center"
  >
    <!-- الشعار والعنوان في الوسط -->
    <div
      class="flex-grow-1 text-center fw-bold topbar-title d-flex justify-content-center align-items-center gap-2"
    >
      <img
        src="https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/logo.png"
        alt="Logo"
        class="logo-icon"
      />
      <span>{{ welcomeMessage }}</span>
    </div>

    <!-- الأزرار -->
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
.logo-icon {
  height: 28px;
  width: auto;
  object-fit: contain;
  filter: grayscale(20%) brightness(1.2);
}

.topbar-title {
  font-size: 1.1rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.navbar {
  background: linear-gradient(to left, #fdfdfd, #f5f5f5); /* تدرج ناعم */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); /* ظل خفيف للأسفل */
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
