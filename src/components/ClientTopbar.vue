<template>
  <nav dir="ltr" class="navbar navbar-light bg-light px-4 topbar">
    <!-- رسالة الترحيب (تظهر فقط في الشاشات الكبيرة) -->
    <span class="navbar-brand d-none d-md-block">مرحباً بك 👋</span>

    <!-- الأزرار -->
    <div class="ms-auto d-flex gap-2">
      <button class="btn btn-outline-primary btn-sm menu-btn" @click="goToMenu">
        عرض المنيو
      </button>
      <button class="btn btn-outline-danger btn-sm logout-btn" @click="logout">
        تسجيل الخروج
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "ClientTopbar",
  methods: {
    logout() {
      localStorage.removeItem("client_token");
      this.$router.push("/client/login");
    },
    goToMenu() {
      const code = localStorage.getItem("client_link_code");
      if (code) {
        window.open(`https://menu.tiklamu.com/?link_code=${code}`, "_blank");
      } else {
        alert("الرابط غير متوفر");
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
