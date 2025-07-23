// ClientSectionsView.vue
<template>
  <div class="container mt-4">
    <div class="header mb-3 d-flex justify-content-between align-items-center">
      <h2>الأقسام</h2>
      <router-link to="/client/sections/add" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i> إضافة قسم
      </router-link>
    </div>

    <!-- 🔶 مسج التحذير عند تجاوز الحد -->
    <div v-if="limitExceeded" class="alert alert-warning text-center">
      ⚠️ لقد تجاوزت عدد الأقسام المسموح بها في خطتك.
      <br />
      عدد الأقسام المفعّلة حالياً:
      <strong>{{ visibleSections.length }}</strong> /
      {{ levelLimits.max_sections }}
      <br />
      سيتم <span class="text-danger fw-bold">إخفاء</span> بعض الأقسام تلقائيًا
      من المنيو.
      <br />
      لتجنّب ذلك، يُرجى <strong>إخفاء {{ exceededSectionsCount }}</strong>
      قسم/أقسام يدوياً أو ترقية الخطة.
    </div>

    <!-- 🔷 مسج تنبيهي عند بلوغ الحد بدون تجاوز -->
    <div v-else-if="limitReached" class="alert alert-info text-center">
      ℹ️ لقد وصلت إلى الحد الأقصى للأقسام المسموح بها في خطتك (<strong>{{
        visibleSections.length
      }}</strong>
      / {{ levelLimits.max_sections }})، لإضافة المزيد يُرجى ترقية الخطة.
    </div>

    <!-- فلاتر البحث -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input
          v-model="searchTerm"
          placeholder="بحث باسم القسم..."
          class="form-control"
        />
      </div>
      <div class="col-md-4">
        <select v-model="filterStatus" class="form-control">
          <option value="">الكل</option>
          <option value="1">مفعل</option>
          <option value="0">مخفي</option>
        </select>
      </div>
      <div class="col-md-2">
        <button class="btn btn-outline-secondary w-100" @click="resetFilters">
          تفريغ
        </button>
      </div>
    </div>

    <!-- جدول عرض الأقسام -->
    <div v-if="filteredSections.length">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th class="text-center align-middle">#</th>
            <th class="text-center align-middle">الاسم</th>
            <th class="text-center align-middle">الوصف</th>
            <th class="text-center align-middle">صورة</th>
            <th class="text-center align-middle">الحالة</th>
            <th class="text-center align-middle">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(sec, index) in filteredSections"
            :key="sec.se_id"
            :class="{ 'table-danger': sec.se_is_active == 0 }"
          >
            <td class="text-center align-middle">{{ index + 1 }}</td>
            <td class="text-center align-middle">{{ sec.se_name }}</td>
            <td class="text-center align-middle">{{ sec.se_description }}</td>
            <td>
              <img
                v-if="sec.se_image"
                :src="getImageUrl(sec.se_image)"
                alt="صورة القسم"
                width="40"
                height="40"
                onerror="this.style.display='none'"
              />
            </td>
            <td class="text-center align-middle">
              <button
                class="btn btn-sm w-50"
                :class="sec.se_is_active ? 'btn-success' : 'btn-danger'"
                style="min-width: 80px"
                @click="toggleStatus(sec)"
              >
                {{ sec.se_is_active ? "مفعل" : "مخفي" }}
              </button>
            </td>
            <td class="text-center align-middle">
              <router-link
                :to="`/client/sections/edit/${sec.se_id}`"
                class="btn btn-sm btn-warning w-50"
                style="min-width: 80px"
              >
                تعديل
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="alert alert-warning">لا توجد أقسام مطابقة.</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ClientSectionsView",
  data() {
    return {
      sections: [],
      searchTerm: "",
      filterStatus: "",
      clientLinkCode: localStorage.getItem("client_link_code"),
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL, // ✅ هنا الإضافة
      levelLimits: {
        max_sections: 1000,
      },
    };
  },
  computed: {
    visibleSections() {
      return this.sections.filter((s) => s.se_is_active == 1);
    },
    filteredSections() {
      return this.sections.filter((sec) => {
        const matchesSearch = sec.se_name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
        const matchesStatus =
          this.filterStatus === "" || sec.se_is_active == this.filterStatus;
        return matchesSearch && matchesStatus;
      });
    },
    exceededSectionsCount() {
      if (this.levelLimits.max_sections === "unlimited") return 0;
      return Math.max(
        0,
        this.visibleSections.length - this.levelLimits.max_sections
      );
    },
    limitReached() {
      return (
        this.levelLimits.max_sections !== "unlimited" &&
        this.visibleSections.length > this.levelLimits.max_sections
      );
    },
  },
  methods: {
    getImageUrl(filename) {
      if (filename.startsWith("http")) {
        return filename; // صورة من ImageKit
      }
      return `${this.apiBaseUrl}/uploads/sections/${this.clientLinkCode}/${filename}`; // صورة محلية
    },
    async loadSections() {
      const token = localStorage.getItem("client_token");
      const client_id = localStorage.getItem("client_id");

      try {
        const response = await axios.get(
          `${this.apiBaseUrl}/api/agent/sections`,
          {
            params: { client_id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.sections = response.data;
      } catch (err) {
        console.error("خطأ أثناء جلب الأقسام", err);
      }
    },
    async toggleStatus(section) {
      const token = localStorage.getItem("client_token");
      try {
        await axios.put(
          `${this.apiBaseUrl}/api/agent/sections/${section.se_id}`,
          {
            name: section.se_name,
            description: section.se_description,
            is_active: section.se_is_active ? 0 : 1,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        section.se_is_active = section.se_is_active ? 0 : 1;
      } catch (err) {
        console.error("فشل في تحديث الحالة", err);
      }
    },
    async loadLimits() {
      const token = localStorage.getItem("client_token");

      try {
        const response = await axios.get(
          `${this.apiBaseUrl}/api/agent/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.levelLimits.max_sections =
          response.data?.level?.sectionLimit === "غير محدود"
            ? "unlimited"
            : parseInt(response.data.level.sectionLimit || 1000);
      } catch (err) {
        console.error("فشل في جلب حدود الخطة:", err);
      }
    },
    resetFilters() {
      this.searchTerm = "";
      this.filterStatus = "";
    },
  },
  async mounted() {
    this.loadSections();
    await this.loadLimits();
  },
};
</script>
