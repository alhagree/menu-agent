<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>الأصناف</h2>
      <router-link to="/client/items/add" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i> إضافة صنف
      </router-link>
    </div>

    <!-- 🟡 حالة التحميل -->
    <div
      v-if="itemsLimitStatus === 'loading'"
      class="alert alert-info text-center"
    >
      ⏳ جاري تحميل بيانات الأصناف وحدود الخطة...
    </div>

    <!-- 🔴 تجاوز الحد -->
    <div
      v-else-if="itemsLimitStatus === 'exceeded'"
      class="alert alert-warning text-center"
    >
      ⚠️ لقد تجاوزت الحد المسموح به للأصناف الفعالة في خطتك.
      <br />
      عدد الأصناف المفعّلة حالياً: <strong>{{ visibleItems.length }}</strong> /
      <strong>{{ levelLimits.max_items }}</strong>
      <br />
      سيتم <strong class="text-danger">إخفاء</strong> بعض الأصناف تلقائيًا في
      المنيو.
      <br />
      يُنصح بإخفاء بعض الأصناف يدويًا أو ترقية خطتك.
    </div>

    <!-- 🔵 عند الوصول للحد ووجود أصناف غير مفعّلة -->
    <div
      v-else-if="itemsLimitStatus === 'atLimit'"
      class="alert alert-info text-center"
    >
      ℹ️ لقد وصلت إلى الحد الأقصى للأصناف المسموح بها في خطتك (<strong>
        {{ visibleItems.length }} / {{ levelLimits.max_items }}</strong
      >).
      <br />
      لديك أصناف غير مفعّلة لن تظهر في المنيو، ولا يمكن تفعيلها ما لم يتم ترقية
      الخطة.
    </div>

    <!-- 🔵 يوجد مجال للتفعيل -->
    <div
      v-else-if="itemsLimitStatus === 'underLimit'"
      class="alert alert-info text-center"
    >
      ℹ️ عدد الأصناف المفعّلة حالياً أقل من الحد المسموح في خطتك (<strong>
        {{ visibleItems.length }} / {{ levelLimits.max_items }}</strong
      >).
      <br />
      يمكنك تفعيل المزيد من الأصناف أو ترقية الخطة لزيادة الحد.
    </div>

    <!-- فلاتر -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input
          v-model="searchTerm"
          class="form-control"
          placeholder="بحث باسم الصنف..."
        />
      </div>
      <div class="col-md-4">
        <select v-model="filterSection" class="form-control">
          <option value="">كل الأقسام</option>
          <option v-for="sec in sections" :key="sec.se_id" :value="sec.se_id">
            {{ sec.se_name }}
          </option>
        </select>
      </div>
      <div class="col-md-2">
        <button class="btn btn-outline-secondary w-100" @click="resetFilters">
          تفريغ
        </button>
      </div>
    </div>

    <!-- تحميل -->
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">جاري التحميل...</p>
    </div>

    <!-- جدول الأصناف -->
    <div v-else-if="paginatedItems.length">
      <table class="table table-bordered align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>السعر</th>
            <th>القسم</th>
            <th>الحالة</th>
            <th>التوفر</th>
            <th>صورة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedItems"
            :key="item.it_id"
            :class="{ 'table-danger': item.it_is_active == 0 }"
          >
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ item.it_name }}</td>
            <td>{{ normalizeArabicNumber(item.it_price).toLocaleString() }}</td>
            <td>{{ item.se_name }}</td>
            <td>
              <button
                class="btn btn-sm w-50"
                :class="item.it_is_active ? 'btn-success' : 'btn-danger'"
                @click="toggleStatus(item)"
              >
                {{ item.it_is_active ? "معروض" : "مخفي" }}
              </button>
            </td>
            <td>
              <button
                class="btn btn-sm w-50"
                :class="item.it_available ? 'btn-success' : 'btn-danger'"
                @click="toggleAvailable(item)"
              >
                {{ item.it_available ? "متاح" : "غير متاح" }}
              </button>
            </td>
            <td>
              <img
                :src="getImageUrl(item.it_image)"
                alt="صورة"
                width="40"
                height="40"
              />
            </td>
            <td>
              <router-link
                :to="`/client/items/edit/${item.it_id}`"
                class="btn btn-sm btn-warning w-50"
              >
                تعديل
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ترقيم الصفحات -->
      <nav>
        <ul class="pagination justify-content-center">
          <li
            class="page-item"
            :class="{ disabled: currentPage === 1 }"
            @click="currentPage > 1 && currentPage--"
          >
            <a class="page-link">السابق</a>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >
            <a class="page-link">{{ page }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
            @click="currentPage < totalPages && currentPage++"
          >
            <a class="page-link">التالي</a>
          </li>
        </ul>
      </nav>
    </div>

    <div v-else class="alert alert-warning text-center">
      لا توجد أصناف مطابقة.
    </div>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "ClientItemsView",
  inject: ["showToast"],
  data() {
    return {
      items: [],
      sections: [],
      searchTerm: "",
      filterSection: "",
      currentPage: 1,
      itemsPerPage: 10,
      clientLinkCode: localStorage.getItem("client_link_code"),
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
      isLoading: false,
      levelLimits: {
        max_items: 1000,
      },
    };
  },
  computed: {
    visibleItems() {
      return this.items.filter((i) => i.it_is_active == 1);
    },
    itemsLimitStatus() {
      if (!this.items || this.items.length === 0) return "loading";
      if (this.levelLimits.max_items === "unlimited") return "unlimited";

      const active = this.visibleItems.length;
      const total = this.items.length;

      if (active > this.levelLimits.max_items) return "exceeded";
      if (active === this.levelLimits.max_items && total > active)
        return "atLimit";
      if (active < this.levelLimits.max_items && total > active)
        return "underLimit";
      return "ok";
    },
    filteredItems() {
      return this.items.filter((item) => {
        const nameMatch = item.it_name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
        const sectionMatch =
          this.filterSection === "" || item.it_se_id == this.filterSection;
        return nameMatch && sectionMatch;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
  },
  methods: {
    async toggleStatus(item) {
      const price = this.normalizeArabicNumber(item.it_price);
      if (isNaN(price) || price === "") {
        this.showToast(
          "يرجى التأكد من كتابة السعر بشكل صحيح بالأرقام فقط.",
          "warning"
        );
        return;
      }

      try {
        await api.put(`/items/${item.it_id}`, {
          it_name: item.it_name,
          it_price: price,
          it_description: item.it_description,
          it_se_id: item.it_se_id,
          it_is_active: item.it_is_active ? 0 : 1,
          it_available: item.it_available,
        });
        item.it_is_active = item.it_is_active ? 0 : 1;
        this.showToast("تم تحديث حالة العرض", "success");
      } catch (err) {
        this.showToast("فشل في تحديث الحالة", "error");
        console.error(err);
      }
    },
    async toggleAvailable(item) {
      const price = this.normalizeArabicNumber(item.it_price);
      try {
        await api.put(`/items/${item.it_id}`, {
          it_name: item.it_name,
          it_price: price,
          it_description: item.it_description,
          it_se_id: item.it_se_id,
          it_is_active: item.it_is_active,
          it_available: item.it_available ? 0 : 1,
        });
        item.it_available = item.it_available ? 0 : 1;
        this.showToast("تم تحديث حالة التوفر", "success");
      } catch (err) {
        this.showToast("فشل في تحديث التوفر", "error");
        console.error(err);
      }
    },
    getImageUrl(filename) {
      if (!filename || filename === "null") {
        return "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/item.png?updatedAt=1753025679030";
      }
      if (filename.startsWith("http")) {
        return filename;
      }
      return `${this.apiBaseUrl}/uploads/items/${this.clientLinkCode}/${filename}`;
    },
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
    async loadItems() {
      this.isLoading = true;
      try {
        const res = await api.get("/items");
        this.items = res.data;
      } catch (err) {
        this.showToast("فشل في جلب الأصناف", "error");
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async loadSections() {
      this.isLoading = true;
      try {
        const res = await api.get("/sections");
        this.sections = res.data;
      } catch (err) {
        this.showToast("فشل في جلب الأقسام", "error");
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async loadLimits() {
      try {
        const res = await api.get("/dashboard");
        const max = res.data?.level?.itemLimit || 1000;
        this.levelLimits.max_items =
          max === "غير محدود" ? "unlimited" : parseInt(max);
      } catch (err) {
        console.error("فشل في جلب حدود الأصناف:", err);
      }
    },
    resetFilters() {
      this.searchTerm = "";
      this.filterSection = "";
      this.currentPage = 1;
    },
  },
  async mounted() {
    await this.loadLimits();
    this.loadSections();
    this.loadItems();
  },
};
</script>
