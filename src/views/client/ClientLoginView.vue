<template>
  <div class="container mt-5 text-center" style="max-width: 500px">
    <!-- الشعار -->
    <img
      :src="logoUrl"
      alt="Tiklamu Logo"
      class="mb-4"
      style="max-height: 200px"
    />

    <!-- معلومات النظام -->
    <h2 class="mb-2">نظام ادارة منيو الكتروني</h2>
    <h4 class="mb-4 text-muted">تسجيل دخول العميل</h4>

    <!-- نموذج تسجيل الدخول -->
    <div class="card p-4 shadow-sm">
      <div class="form-group mb-3 text-start">
        <label>اسم المستخدم</label>
        <input type="text" class="form-control" v-model="username" />
      </div>

      <div class="form-group mb-3 text-start">
        <label>كلمة المرور</label>
        <input type="password" class="form-control" v-model="password" />
      </div>

      <button class="btn btn-primary w-100" @click="login" :disabled="loading">
        تسجيل الدخول
      </button>
    </div>

    <!-- ⚠️ رسالة الخطأ الموحدة -->
    <div v-if="errorMessage" class="centered-container">
      <p class="error-message" :style="{ color: errorColor }">
        {{ errorMessage }}
      </p>
      <img class="failed-image" :src="errorImage" alt="خطأ" />
    </div>
  </div>
</template>

<script>
import api from "../../axios";

export default {
  name: "ClientLoginView",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      errorType: null,
      loading: false,
      logoUrl:
        "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/logo.png",
      failedImageUrl:
        "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/failed.png",
      errorImages: {
        account_inactive:
          "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/inactive.png",
        subscription_inactive:
          "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/no-subscription.png",
        subscription_expired:
          "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/expired.png",
        invalid_credentials:
          "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/failed.png",
      },
      errorColors: {
        account_inactive: "#FF971E",
        subscription_inactive: "#6c757d",
        subscription_expired: "#dc3545",
        invalid_credentials: "#6c8888",
      },
    };
  },
  computed: {
    errorImage() {
      return this.errorImages[this.errorType] || this.failedImageUrl;
    },
    errorColor() {
      return this.errorColors[this.errorType] || "#dc3545";
    },
  },
  methods: {
    async login() {
      this.errorMessage = "";
      this.errorType = null;
      this.loading = true;

      try {
        const response = await api.post("/login", {
          username: this.username,
          password: this.password,
        });

        localStorage.setItem("client_token", response.data.token);
        localStorage.setItem("client_link_code", response.data.link_code);

        this.$router.push("/client");
      } catch (err) {
        this.errorMessage = err.response?.data?.error || "فشل تسجيل الدخول";
        this.errorType = err.response?.data?.error_code || null;
        console.error("❌ Login Error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
