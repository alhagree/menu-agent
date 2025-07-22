<template>
  <nav
    dir="ltr"
    class="navbar navbar-light bg-light px-4 d-flex justify-content-between align-items-center"
  >
    <!-- يمين: فارغ -->
    <div style="width: 200px"></div>

    <!-- وسط: الترحيب -->
    <div class="text-center flex-grow-1">
      <span class="fw-bold">{{ welcomeMessage }}</span>
    </div>

    <!-- يسار: الأزرار -->
    <div class="d-flex gap-2">
      <button class="btn btn-outline-primary btn-sm" @click="goToMenu">
        عرض المنيو
      </button>
      <button class="btn btn-outline-danger btn-sm" @click="logout">
        تسجيل الخروج
      </button>
    </div>
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
.topbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* تأثير عند المرور على الأزرار */
.menu-btn:hover,
.logout-btn:hover {
  transform: scale(1.05);
  transition: 0.2s ease-in-out;
}
</style>
