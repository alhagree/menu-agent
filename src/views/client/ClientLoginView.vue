<template>
  <div class="container mt-5" style="max-width: 500px">
    <h3 class="mb-4">تسجيل دخول العميل</h3>

    <div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>

    <div class="form-group mb-3">
      <label>اسم المستخدم</label>
      <input type="text" class="form-control" v-model="username" />
    </div>

    <div class="form-group mb-3">
      <label>كلمة المرور</label>
      <input type="password" class="form-control" v-model="password" />
    </div>

    <button class="btn btn-primary w-100" @click="login" :disabled="loading">
      تسجيل الدخول
    </button>
  </div>
</template>

<script>
import api from "../../axios"; // ← استيراد ملف api.js

export default {
  name: "ClientLoginView",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      this.errorMessage = "";
      this.loading = true;

      try {
        const response = await api.post("/login", {
          username: this.username,
          password: this.password,
        });

        console.log("✅ Login Response:", response.data);

        localStorage.setItem("client_token", response.data.token);
        localStorage.setItem("client_link_code", response.data.link_code);

        this.$router.push("/client");
      } catch (err) {
        this.errorMessage = err.response?.data?.error || "فشل تسجيل الدخول";
        console.error("❌ Login Error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
