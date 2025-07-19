//agent-dashboard\src\views\client\SectionFormView.vue
<template>
  <div class="container mt-4" style="max-width: 600px">
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
        <div v-if="section.imageUrl" class="mt-2">
          <img
            :src="section.imageUrl"
            alt="الصورة الحالية"
            width="200"
            height="200"
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

        <button class="btn btn-success action-btn" @click="submitForm">
          <i class="bi bi-save2 me-1"></i>
          {{ isEditMode ? "تحديث القسم" : "إضافة القسم" }}
        </button>

        <button
          v-if="isEditMode"
          class="btn btn-danger action-btn"
          @click="confirmDelete"
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
        this.section.imageUrl = sec.se_image
          ? `${this.apiBaseUrl}/uploads/sections/${link_code}/${sec.se_image}`
          : "";
      } catch (err) {
        console.error("فشل في تحميل بيانات القسم", err);
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
        alert("تم حذف القسم بنجاح");
        this.$router.push("/client/sections");
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          alert(err.response.data.error);
        } else {
          console.error("خطأ أثناء الحذف", err);
        }
      }
    },

    async submitForm() {
      if (!this.section.name.trim()) {
        alert("يرجى إدخال اسم القسم");
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
        } else {
          await axios.post(`${this.apiBaseUrl}/api/agent/sections`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
        }

        this.$router.push("/client/sections");
      } catch (err) {
        console.error("خطأ أثناء الحفظ", err);
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
</style>
