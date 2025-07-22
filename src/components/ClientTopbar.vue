<template>
  <nav
    class="navbar navbar-light bg-light px-4 d-flex justify-content-between align-items-center"
  >
    <div class="flex-grow-1 text-center fw-bold topbar-title">
      {{ welcomeMessage }}
    </div>

    <div class="d-flex gap-2 align-items-center">
      <button class="btn btn-outline-secondary btn-sm" @click="goToMenu">
        <i class="bi bi-box-arrow-up-right me-1"></i> عرض المنيو الخاص بك
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
