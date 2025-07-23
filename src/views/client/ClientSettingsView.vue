// ClientSettingsView.vue
<template>
  <div class="container mt-4" style="max-width: 700px">
    <!-- شاشة التحميل -->
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader-content">
        <div class="spinner-border text-light mb-3"></div>
        <div>جاري حفظ التغييرات...</div>
      </div>
    </div>

    <div class="card shadow-sm p-4">
      <h4 class="text-center fw-bold mb-4">
        <i class="bi bi-gear me-1"></i> إعدادات الحساب
      </h4>

      <!-- الاسم التجاري -->
      <div class="mb-3">
        <label class="form-label fw-bold">الاسم التجاري المعروض</label>
        <input
          v-model="form.cl_name"
          type="text"
          class="form-control"
          :disabled="!canCustomize"
        />
      </div>

      <!-- اسم العميل -->
      <div class="mb-3">
        <label class="form-label fw-bold">اسم العميل</label>
        <input
          v-model="form.cl_fullname"
          type="text"
          class="form-control"
          disabled
        />
      </div>

      <!-- رقم الهاتف -->
      <div class="mb-3">
        <label class="form-label fw-bold">رقم الهاتف</label>
        <input
          v-model="form.cl_phone"
          type="tel"
          class="form-control"
          disabled
        />
      </div>

      <!-- رفع الشعار -->
      <div class="mb-3">
        <label class="form-label fw-bold">شعار المشروع</label><br />
        <img
          v-if="currentLogo"
          :src="currentLogo"
          alt="Logo"
          class="img-thumbnail mb-2"
          style="max-height: 100px"
        />
        <input
          type="file"
          @change="handleFileChange('logo', $event)"
          class="form-control"
          :disabled="!canCustomize"
        />
      </div>

      <!-- تنبيه الخطة -->
      <div v-if="!canCustomize" class="alert alert-info text-center mt-3">
        ⚠️ هذه الخطة لا تسمح بتعديل الاسم التجاري أو الشعار. يرجى الترقية
        للاستفادة من هذه المزايا.
      </div>

      <!-- زر حفظ -->
      <button
        @click="saveSettings"
        class="btn btn-success w-100 mt-4"
        :disabled="isLoading || !canCustomize"
      >
        💾 حفظ التغييرات
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ClientSettingsView",
  inject: ["showToast"],
  data() {
    return {
      form: {
        cl_name: "",
        cl_phone: "",
        cl_fullname: "",
      },
      canCustomize: true,
      logoFile: null,
      backgroundFile: null,
      currentLogo: "",
      currentBackground: "",
      isLoading: false,
      link_code: localStorage.getItem("client_link_code") || "",
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
    };
  },
  methods: {
    async fetchData() {
      try {
        const token = localStorage.getItem("client_token");
        const res = await axios.get(
          `${this.apiBaseUrl}/api/agent/settings/subscription`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        this.form.cl_name = data.cl_name;
        this.form.cl_phone = data.cl_phone;
        this.form.cl_fullname = data.cl_fullname;
        this.currentLogo = data.st_logo;
        this.currentBackground = data.st_background;
        this.canCustomize = data.level_features?.can_customize_logo;
      } catch (err) {
        console.error("فشل تحميل بيانات الإعدادات", err);
        this.showToast("فشل تحميل بيانات الإعدادات", "error");
      }
    },

    handleFileChange(field, event) {
      const file = event.target.files[0];
      if (field === "logo") this.logoFile = file;
      else if (field === "background") this.backgroundFile = file;
    },

    async saveSettings() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem("client_token");

        const formData = new FormData();
        formData.append("cl_name", this.form.cl_name);
        formData.append("cl_phone", this.form.cl_phone);
        if (this.logoFile) formData.append("logo", this.logoFile);
        if (this.backgroundFile)
          formData.append("background", this.backgroundFile);

        await axios.put(`${this.apiBaseUrl}/api/agent/settings`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        this.showToast("✅ تم حفظ التغييرات بنجاح", "success");
        this.fetchData();
      } catch (err) {
        console.error("فشل حفظ الإعدادات", err);
        this.showToast("❌ حدث خطأ أثناء الحفظ", "error");
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
img.img-thumbnail {
  display: block;
  margin-bottom: 8px;
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-content {
  text-align: center;
  color: #fff;
  font-size: 1.2rem;
}
</style>
