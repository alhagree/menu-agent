//agent-dashboard\src\views\client\ClientSettingsView.vue
<template>
  <div class="container mt-5" style="max-width: 800px">
    <div class="card p-4 shadow-sm">
      <h4 class="mb-4 text-center">⚙️ إعدادات الحساب</h4>

      <div class="mb-3">
        <label class="form-label fw-bold">اسم العميل</label>
        <input v-model="form.cl_name" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">رقم الهاتف</label>
        <input v-model="form.cl_phone" type="tel" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">شعار المشروع</label><br />
        <img
          v-if="currentLogo"
          :src="`${apiBaseUrl}/uploads/settings/${link_code}/${currentLogo}`"
          alt="Logo"
          class="img-thumbnail mb-2"
          style="max-height: 100px"
        />
        <input
          type="file"
          @change="handleFileChange('logo', $event)"
          class="form-control"
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">صورة الخلفية</label><br />
        <img
          v-if="currentBackground"
          :src="`${apiBaseUrl}/uploads/settings/${link_code}/${currentBackground}`"
          alt="Background"
          class="img-thumbnail mb-2"
          style="max-height: 120px"
        />
        <input
          type="file"
          @change="handleFileChange('background', $event)"
          class="form-control"
        />
      </div>

      <button @click="saveSettings" class="btn btn-success w-100 mt-3">
        💾 حفظ التغييرات
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ClientSettingsView",
  data() {
    return {
      form: {
        cl_name: "",
        cl_phone: "",
      },
      logoFile: null,
      backgroundFile: null,
      currentLogo: "",
      currentBackground: "",
      link_code: localStorage.getItem("client_link_code") || "",
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL, // ✅
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
        this.currentLogo = data.st_logo;
        this.currentBackground = data.st_background;
      } catch (err) {
        console.error("فشل تحميل بيانات الإعدادات", err);
      }
    },
    async saveSettings() {
      try {
        const token = localStorage.getItem("client_token");

        const formData = new FormData();
        if (this.logoFile) formData.append("logo", this.logoFile);
        if (this.backgroundFile)
          formData.append("background", this.backgroundFile);

        if (this.logoFile || this.backgroundFile) {
          await axios.post(
            `${this.apiBaseUrl}/api/agent/settings/upload-images`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }

        await axios.put(
          `${this.apiBaseUrl}/api/agent/settings/me`,
          { cl_name: this.form.cl_name, cl_phone: this.form.cl_phone },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert("✅ تم حفظ التغييرات بنجاح");
        this.fetchData();
      } catch (err) {
        console.error("فشل حفظ الإعدادات", err);
        alert("❌ حدث خطأ أثناء الحفظ");
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
</style>
