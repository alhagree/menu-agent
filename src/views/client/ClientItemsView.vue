<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>الأصناف</h2>
      <router-link to="/client/items/add" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i> إضافة صنف
      </router-link>
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

    <!-- جدول الأصناف -->
    <div v-if="paginatedItems.length">
      <table class="table table-bordered align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>السعر</th>
            <th>القسم</th>
            <th>الحالة</th>
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
            <td>{{ item.it_price.toLocaleString() }}</td>
            <td>{{ item.se_name }}</td>
            <td>
              <button
                class="btn btn-sm"
                :class="item.it_is_active ? 'btn-success' : 'btn-danger'"
                @click="toggleStatus(item)"
              >
                {{ item.it_is_active ? "معروض" : "مخفي" }}
              </button>
            </td>
            <td>
              <img
                v-if="item.it_image"
                :src="`${apiBaseUrl}/uploads/items/${clientLinkCode}/${item.it_image}`"
                alt="صورة"
                width="40"
                height="40"
                onerror="this.style.display='none'"
              />
            </td>
            <td>
              <router-link
                :to="`/client/items/edit/${item.it_id}`"
                class="btn btn-sm btn-warning"
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
import api from "../../axios"; // ← استخدام api بدلاً من axios مباشرة

export default {
  name: "ClientItemsView",
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
    };
  },
  computed: {
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
    async loadItems() {
      try {
        const res = await api.get("/items");
        this.items = res.data;
      } catch (err) {
        console.error("فشل في جلب الأصناف", err);
      }
    },
    async loadSections() {
      try {
        const res = await api.get("/sections");
        this.sections = res.data;
      } catch (err) {
        console.error("فشل في جلب الأقسام", err);
      }
    },
    async toggleStatus(item) {
      try {
        await api.put(`/items/${item.it_id}`, {
          it_name: item.it_name,
          it_price: item.it_price,
          it_description: item.it_description,
          it_se_id: item.it_se_id,
          it_is_active: item.it_is_active ? 0 : 1,
        });
        item.it_is_active = item.it_is_active ? 0 : 1;
      } catch (err) {
        console.error("فشل في تغيير الحالة", err);
      }
    },
    resetFilters() {
      this.searchTerm = "";
      this.filterSection = "";
      this.currentPage = 1;
    },
  },
  mounted() {
    this.loadSections();
    this.loadItems();
  },
};
</script>
