<template>
  <div class="container mt-4" style="max-width: 600px">
    <!-- نافذة تحميل -->
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader-content">
        <div class="spinner-border text-light mb-3"></div>
        <div>جاري حفظ البيانات...</div>
      </div>
    </div>

    <h3 class="mb-4">
      <i class="bi bi-collection me-2"></i>
      {{ isEditMode ? "تعديل القسم" : "إضافة قسم جديد" }}
    </h3>

    <hr class="my-3" />

    <div class="card p-4">
      <div class="form-group mb-3">
        <label>اسم القسم</label>
        <input v-model="section.name" type="text" class="form-control" />
      </div>

      <div class="form-group mb-3">
        <label>الوصف</label>
        <textarea v-model="section.description" class="form-control" rows="2" />
      </div>

      <div class="form-group mb-3">
        <label>صورة</label>
        <input type="file" class="form-control" @change="handleImage" />
        <div v-if="section.imageUrl" class="mt-2 text-center">
          <img
            :src="section.imageUrl"
            alt="الصورة الحالية"
            class="img-thumbnail"
            style="max-width: 200px; max-height: 200px"
          />
        </div>
      </div>

      <div class="form-check mb-3">
        <input
          v-model="section.is_active"
          type="checkbox"
          class="form-check-input"
          id="activeCheck"
        />
        <label class="form-check-label" for="activeCheck">مفعل</label>
      </div>

      <div class="d-flex justify-content-center gap-3 mt-4">
        <button class="btn btn-secondary action-btn" @click="$router.back()">
          <i class="bi bi-arrow-right-circle me-1"></i> رجوع
        </button>

        <button
          class="btn btn-success action-btn"
          @click="submitForm"
          :disabled="isLoading"
        >
          <i class="bi bi-save2 me-1"></i>
          {{ isEditMode ? "تحديث القسم" : "إضافة القسم" }}
        </button>

        <button
          v-if="isEditMode"
          class="btn btn-danger action-btn"
          @click="confirmDelete"
          :disabled="isLoading"
        >
          <i class="bi bi-trash3 me-1"></i> حذف نهائي
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SectionFormView",
  inject: ["showToast"],
  data() {
    return {
      section: {
        name: "",
        description: "",
        image: null,
        imageUrl: "",
        is_active: true,
      },
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
      isLoading: false,
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.id;
    },
  },
  methods: {
    handleImage(e) {
      const file = e.target.files[0];
      this.section.image = file;
      if (file) {
        this.section.imageUrl = URL.createObjectURL(file);
      }
    },

    async loadSection() {
      const token = localStorage.getItem("client_token");
      const id = this.$route.params.id;
      try {
        const res = await axios.get(
          `${this.apiBaseUrl}/api/agent/sections/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const sec = res.data;
        this.section.name = sec.se_name;
        this.section.description = sec.se_description;
        this.section.is_active = !!sec.se_is_active;

        const link_code = localStorage.getItem("client_link_code");
        if (sec.se_image) {
          if (sec.se_image.startsWith("http")) {
            this.section.imageUrl = sec.se_image;
          } else {
            this.section.imageUrl = `${this.apiBaseUrl}/uploads/sections/${link_code}/${sec.se_image}`;
          }
        } else {
          this.section.imageUrl = "";
        }
      } catch (err) {
        console.error("فشل في تحميل بيانات القسم", err);
        this.showToast("❌ فشل تحميل القسم", "danger");
      }
    },

    async confirmDelete() {
      if (
        !confirm(
          "هل أنت متأكد أنك تريد حذف هذا القسم؟ لا يمكن التراجع بعد الحذف!"
        )
      ) {
        return;
      }

      const token = localStorage.getItem("client_token");
      const id = this.$route.params.id;

      try {
        await axios.delete(`${this.apiBaseUrl}/api/agent/sections/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.showToast("🗑️ تم حذف القسم بنجاح", "success");
        this.$router.push("/client/sections");
      } catch (err) {
        if (err.response?.data?.error) {
          this.showToast(err.response.data.error, "danger");
        } else {
          console.error("خطأ أثناء الحذف", err);
          this.showToast("❌ حدث خطأ أثناء الحذف", "danger");
        }
      }
    },

    async submitForm() {
      if (!this.section.name.trim()) {
        this.showToast("يرجى إدخال اسم القسم", "danger");
        return;
      }

      const token = localStorage.getItem("client_token");
      const client_id = localStorage.getItem("client_id");

      const formData = new FormData();
      formData.append("name", this.section.name);
      formData.append("description", this.section.description);
      formData.append("is_active", this.section.is_active ? 1 : 0);
      formData.append("client_id", client_id);
      if (this.section.image) {
        formData.append("image", this.section.image);
      }

      this.isLoading = true;
      try {
        if (this.isEditMode) {
          const id = this.$route.params.id;
          await axios.put(
            `${this.apiBaseUrl}/api/agent/sections/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          this.showToast("✅ تم تحديث القسم بنجاح", "success");
        } else {
          await axios.post(`${this.apiBaseUrl}/api/agent/sections`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          this.showToast("✅ تم إضافة القسم بنجاح", "success");
        }

        this.$router.push("/client/sections");
      } catch (err) {
        console.error("خطأ أثناء الحفظ", err);
        this.showToast("❌ فشل في حفظ البيانات", "danger");
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    if (this.isEditMode) {
      this.loadSection();
    }
  },
};
</script>

<style scoped>
.action-btn {
  width: 150px;
}

/* نافذة التحميل */
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
