<template>
  <div class="container mt-4" style="max-width: 600px">
    <!-- نافذة تحميل -->
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader-content">
        <div class="spinner-border text-light mb-3"></div>
        <div>جاري حفظ البيانات...</div>
      </div>
    </div>

    <h3 class="mb-4 text-center">
      {{ isEditMode ? "🛠 تعديل الصنف" : "➕ إضافة صنف" }}
    </h3>

    <div class="card p-4">
      <!-- اسم الصنف -->
      <div class="form-group mb-3">
        <label>اسم الصنف</label>
        <input v-model="item.name" type="text" class="form-control" required />
      </div>

      <!-- السعر -->
      <div class="form-group mb-3">
        <label>السعر</label>
        <input
          v-model="item.price"
          @input="item.price = normalizeArabicNumber(item.price)"
          type="text"
          class="form-control"
          placeholder="مثال: 10000"
          required
        />
      </div>

      <!-- الوصف -->
      <div class="form-group mb-3">
        <label>الوصف</label>
        <textarea
          v-model="item.description"
          class="form-control"
          rows="2"
          required
        />
      </div>

      <!-- القسم -->
      <div class="form-group mb-3">
        <label>القسم</label>
        <select v-model="item.sectionId" class="form-control" required>
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
        <div class="mt-2 text-center">
          <img
            :src="item.imageUrl || defaultImage"
            alt="صورة الصنف"
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

      <!-- التوفر -->
      <div class="form-check mb-3">
        <input
          v-model="item.available"
          type="checkbox"
          class="form-check-input"
          id="availableCheck"
        />
        <label class="form-check-label" for="availableCheck">متوفر</label>
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
          :disabled="isLoading"
        >
          <i class="bi bi-save"></i>
          {{ isEditMode ? "تحديث الصنف" : "إضافة الصنف" }}
        </button>
        <button
          v-if="isEditMode"
          class="btn btn-danger px-4"
          style="min-width: 150px"
          @click="deleteItem"
          :disabled="isLoading"
        >
          <i class="bi bi-trash"></i> حذف نهائي
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../axios";

export default {
  name: "ClientItemFormView",
  inject: ["showToast"],
  data() {
    return {
      item: {
        name: "",
        price: "",
        description: "",
        sectionId: "",
        image: null,
        imageUrl: "",
        is_active: true,
        available: true,
      },
      isLoading: false,
      sections: [],
      defaultImage:
        "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/item.png?updatedAt=1753025679030",
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.id;
    },
  },
  methods: {
    normalizeArabicNumber(input) {
      const arabicNums = "٠١٢٣٤٥٦٧٨٩";
      return input
        .toString()
        .split("")
        .map((char) =>
          arabicNums.includes(char) ? arabicNums.indexOf(char) : char
        )
        .join("");
    },
    isValidPrice(input) {
      const normalized = this.normalizeArabicNumber(input);
      return /^[0-9]+(\.[0-9]+)?$/.test(normalized);
    },
    handleImage(e) {
      const file = e.target.files[0];
      this.item.image = file;
      if (file) {
        this.item.imageUrl = URL.createObjectURL(file);
      }
    },
    async loadSections() {
      const link_code = localStorage.getItem("client_link_code");
      const res = await api.get("/sections", { params: { link_code } });
      this.sections = res.data;
    },
    async loadItem() {
      const id = this.$route.params.id;
      const res = await api.get(`/items/${id}`);
      const it = res.data;
      this.item.name = it.it_name;
      this.item.price = this.normalizeArabicNumber(it.it_price.toString());
      this.item.description = it.it_description;
      this.item.sectionId = it.it_se_id;
      this.item.is_active = !!it.it_is_active;
      this.item.available = !!it.it_available;
      this.item.imageUrl = it.it_image
        ? it.it_image.startsWith("http")
          ? it.it_image
          : `${import.meta.env.VITE_API_BASE_URL}/uploads/items/${
              it.link_code
            }/${it.it_image}`
        : "";
    },
    async submitForm() {
      if (!this.item.name.trim())
        return this.showToast("يرجى إدخال اسم الصنف", "error");
      if (!this.item.description.trim())
        return this.showToast("يرجى إدخال وصف الصنف", "error");
      if (!this.item.sectionId)
        return this.showToast("يرجى اختيار القسم", "error");
      if (!this.isValidPrice(this.item.price)) {
        return this.showToast("يرجى إدخال السعر بالأرقام فقط", "error");
      }

      const link_code = localStorage.getItem("client_link_code");
      const formData = new FormData();
      formData.append("it_name", this.item.name);
      formData.append("it_price", this.normalizeArabicNumber(this.item.price));
      formData.append("it_description", this.item.description);
      formData.append("it_se_id", this.item.sectionId);
      formData.append("it_is_active", this.item.is_active ? 1 : 0);
      formData.append("it_available", this.item.available ? 1 : 0);
      formData.append("link_code", link_code);
      if (this.item.image) {
        formData.append("image", this.item.image);
      }

      this.isLoading = true;
      try {
        if (this.isEditMode) {
          const id = this.$route.params.id;
          await api.put(`/items/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          this.showToast("✅ تم تحديث الصنف بنجاح", "success");
        } else {
          await api.post("/items", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          this.showToast("✅ تم إضافة الصنف بنجاح", "success");
        }

        this.$router.push("/client/items");
      } catch (err) {
        this.showToast("❌ حدث خطأ أثناء الحفظ", "error");
        console.error("خطأ أثناء الحفظ", err);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteItem() {
      const id = this.$route.params.id;
      if (!confirm("هل أنت متأكد من حذف الصنف؟ لا يمكن التراجع.")) return;
      try {
        await api.delete(`/items/${id}`);
        this.showToast("🗑️ تم حذف الصنف بنجاح", "success");
        this.$router.push("/client/items");
      } catch (err) {
        this.showToast("فشل في حذف الصنف", "error");
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

<style scoped>
img.img-thumbnail {
  display: block;
  margin: auto;
}

/* نفس ستايل نافذة التحميل */
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
