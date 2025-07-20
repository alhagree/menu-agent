<!-- ClientItemFormView.vue -->
<template>
  <div class="container mt-4" style="max-width: 600px">
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
            :src="item.imageUrl || '/default-image.png'"
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

      <!-- مؤشر تحميل -->
      <div v-if="isLoading" class="text-center mb-3">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">جاري الحفظ...</p>
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
      },
      isLoading: false,
      sections: [],
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
      this.item.price = this.normalizeArabicNumber(it.it_price.toString());
      this.item.description = it.it_description;
      this.item.sectionId = it.it_se_id;
      this.item.is_active = !!it.it_is_active;
      this.item.imageUrl = it.it_image
        ? it.it_image.startsWith("http")
          ? it.it_image
          : `${import.meta.env.VITE_API_BASE_URL}/uploads/items/${
              it.link_code
            }/${it.it_image}`
        : "";
    },
    async submitForm() {
      // التحقق من الحقول
      if (!this.item.name.trim()) return alert("يرجى إدخال اسم الصنف");
      if (!this.item.description.trim()) return alert("يرجى إدخال وصف الصنف");
      if (!this.item.sectionId) return alert("يرجى اختيار القسم");
      if (!this.isValidPrice(this.item.price)) {
        return alert("يرجى إدخال السعر بالأرقام فقط");
      }

      const link_code = localStorage.getItem("client_link_code");
      const formData = new FormData();
      formData.append("it_name", this.item.name);
      formData.append("it_price", this.normalizeArabicNumber(this.item.price));
      formData.append("it_description", this.item.description);
      formData.append("it_se_id", this.item.sectionId);
      formData.append("it_is_active", this.item.is_active ? 1 : 0);
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
        } else {
          await api.post("/items", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        this.$router.push("/client/items");
      } catch (err) {
        alert("حدث خطأ أثناء الحفظ");
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
        this.$router.push("/client/items");
      } catch (err) {
        alert("فشل في حذف الصنف");
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
