//agent-dashboard\src\views\client\ClientItemFormView.vue
<template>
  <div class="container mt-4" style="max-width: 600px">
    <h3 class="mb-4 text-center">
      {{ isEditMode ? "🛠 تعديل الصنف" : "➕ إضافة صنف" }}
    </h3>

    <div class="card p-4">
      <!-- اسم الصنف -->
      <div class="form-group mb-3">
        <label>اسم الصنف</label>
        <input v-model="item.name" type="text" class="form-control" />
      </div>

      <!-- السعر -->
      <div class="form-group mb-3">
        <label>السعر</label>
        <input
          v-model.number="item.price"
          type="number"
          step="0.01"
          class="form-control"
        />
      </div>

      <!-- الوصف -->
      <div class="form-group mb-3">
        <label>الوصف</label>
        <textarea v-model="item.description" class="form-control" rows="2" />
      </div>

      <!-- القسم -->
      <div class="form-group mb-3">
        <label>القسم</label>
        <select v-model="item.sectionId" class="form-control">
          <option value="">اختر قسم</option>
          <option v-for="sec in sections" :key="sec.se_id" :value="sec.se_id">
            {{ sec.se_name }}
          </option>
        </select>
      </div>

      <!-- صورة -->
      <div class="form-group mb-3">
        <label>صورة</label>
        <input type="file" class="form-control" @change="handleImage" />
        <div v-if="item.imageUrl" class="mt-2 text-center">
          <img
            :src="item.imageUrl"
            alt="الصورة الحالية"
            class="img-thumbnail"
            style="max-width: 200px; max-height: 200px"
          />
        </div>
      </div>

      <!-- الحالة -->
      <div class="form-check mb-3">
        <input
          v-model="item.is_active"
          type="checkbox"
          class="form-check-input"
          id="activeCheck"
        />
        <label class="form-check-label" for="activeCheck">معروض</label>
      </div>

      <!-- الأزرار -->
      <div class="d-flex justify-content-center flex-wrap gap-2 mt-4">
        <button
          class="btn btn-secondary px-4"
          style="min-width: 150px"
          @click="$router.back()"
        >
          <i class="bi bi-arrow-counterclockwise"></i> رجوع
        </button>
        <button
          class="btn btn-success px-4"
          style="min-width: 150px"
          @click="submitForm"
        >
          <i class="bi bi-save"></i>
          {{ isEditMode ? "تحديث الصنف" : "إضافة الصنف" }}
        </button>
        <button
          v-if="isEditMode"
          class="btn btn-danger px-4"
          style="min-width: 150px"
          @click="deleteItem"
        >
          <i class="bi bi-trash"></i> حذف نهائي
        </button>
      </div>
      <!-- الأزرار -->
    </div>
  </div>
</template>

<script>
import api from "../../axios";

export default {
  name: "ClientItemFormView",
  data() {
    return {
      item: {
        name: "",
        price: 0,
        description: "",
        sectionId: "",
        image: null,
        imageUrl: "",
        is_active: true,
      },
      sections: [],
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
      this.item.image = file;
      if (file) {
        this.item.imageUrl = URL.createObjectURL(file);
      }
    },
    async loadSections() {
      const link_code = localStorage.getItem("client_link_code");

      const res = await api.get("/sections", {
        params: { link_code },
      });

      this.sections = res.data;
    },
    async loadItem() {
      const id = this.$route.params.id;
      const res = await api.get(`/items/${id}`);
      const it = res.data;
      this.item.name = it.it_name;
      this.item.price = parseFloat(it.it_price);
      this.item.description = it.it_description;
      this.item.sectionId = it.it_se_id;
      this.item.is_active = !!it.it_is_active;
      this.item.imageUrl = it.it_image
        ? `${import.meta.env.VITE_API_BASE_URL}/uploads/items/${it.link_code}/${
            it.it_image
          }`
        : "";
    },
    async submitForm() {
      if (!this.item.name.trim()) return alert("يرجى إدخال اسم الصنف");
      if (!this.item.sectionId) return alert("يرجى اختيار القسم");

      const link_code = localStorage.getItem("client_link_code");

      const formData = new FormData();
      formData.append("it_name", this.item.name);
      formData.append("it_price", this.item.price);
      formData.append("it_description", this.item.description);
      formData.append("it_se_id", this.item.sectionId);
      formData.append("it_is_active", this.item.is_active ? 1 : 0);
      formData.append("link_code", link_code);
      if (this.item.image) {
        formData.append("image", this.item.image);
      }

      try {
        if (this.isEditMode) {
          const id = this.$route.params.id;
          await api.put(`/items/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.post("/items", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        this.$router.push("/client/items");
      } catch (err) {
        console.error("خطأ أثناء الحفظ", err);
      }
    },
    async deleteItem() {
      const id = this.$route.params.id;
      if (!confirm("هل أنت متأكد من حذف الصنف؟ لا يمكن التراجع.")) return;

      try {
        await api.delete(`/items/${id}`);
        this.$router.push("/client/items");
      } catch (err) {
        console.error("فشل في حذف الصنف", err);
      }
    },
  },
  async mounted() {
    await this.loadSections();
    if (this.isEditMode) await this.loadItem();
  },
};
</script>
