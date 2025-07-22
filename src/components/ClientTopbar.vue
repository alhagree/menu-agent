<template>
  <nav
    class="navbar navbar-light bg-light px-3 py-2 d-flex align-items-center justify-content-between flex-row-reverse"
  >
    <!-- يسار: الأزرار -->
    <div class="d-flex gap-2">
      <button class="btn btn-outline-primary btn-sm menu-btn" @click="goToMenu">
        عرض المنيو
      </button>
      <button class="btn btn-outline-danger btn-sm logout-btn" @click="logout">
        تسجيل الخروج
      </button>
    </div>

    <!-- وسط: الترحيب -->
    <div class="text-center flex-grow-1 d-none d-md-block">
      <span class="fw-bold">{{ welcomeMessage }}</span>
    </div>

    <!-- يمين: حشو أو فراغ لموازنة التصميم -->
    <div style="width: 200px"></div>
  </nav>
</template>

<script>
export default {
  name: "ClientTopbar",
  data() {
    return {
      welcomeMessage: "👋 مرحباً بك",
    };
  },
  mounted() {
    const name = localStorage.getItem("client_name");
    if (name) {
      this.welcomeMessage = `👋 مرحباً ${name}`;
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
        window.open(
          `https://menu.tiklamu.com/?link_code=${linkCode}`,
          "_blank"
        );
      } else {
        alert("رمز المنيو غير متوفر.");
      }
    },
  },
};
</script>

<style scoped>
/* تأثير عند المرور */
.menu-btn:hover,
.logout-btn:hover {
  transform: scale(1.05);
  transition: 0.2s ease-in-out;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

/* خاصية إخفاء الرسالة في الشاشات الصغيرة */
@media (max-width: 767px) {
  .text-center.flex-grow-1 {
    display: none !important;
  }
}
</style>
