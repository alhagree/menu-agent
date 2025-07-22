<template>
  <nav class="navbar navbar-light bg-light px-4">
    <span class="navbar-brand">مرحباً بك 👋</span>
    <button class="btn btn-outline-danger btn-sm" @click="logout">
      تسجيل الخروج
    </button>
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
  },
};
</script>
