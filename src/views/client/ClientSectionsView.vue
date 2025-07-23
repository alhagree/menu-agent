<!-- ClientSectionsView.vue -->
<template>
  <div class="container mt-4">
    <div class="header mb-3 d-flex justify-content-between align-items-center">
      <h2>الأقسام</h2>
      <router-link to="/client/sections/add" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i> إضافة قسم
      </router-link>
    </div>

    <!-- 1️⃣ تجاوز الحد المسموح به -->
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
      لتجنّب ذلك، يُرجى
      <strong>إخفاء {{ exceededSectionsCount }}</strong> قسم/أقسام يدوياً أو
      ترقية الخطة.
    </div>

    <!-- 2️⃣ الوصول للحد الأقصى بدقة -->
    <div v-else-if="limitReached" class="alert alert-info text-center">
      ℹ️ لقد وصلت إلى الحد الأقصى للأقسام المسموح بها في خطتك (<strong>{{
        visibleSections.length
      }}</strong>
      / {{ levelLimits.max_sections }})، لإضافة المزيد يُرجى ترقية الخطة.
    </div>

    <!-- 3️⃣ وجود أقسام مخفية ضمن الحد -->
    <div v-else-if="hasHiddenSections" class="alert alert-info text-center">
      ℹ️ عدد الأقسام المفعّلة حالياً أقل من الحد المسموح (<strong>{{
        visibleSections.length
      }}</strong>
      / {{ levelLimits.max_sections }})، ويوجد
      <strong>{{ hiddenSectionsCount }}</strong> قسم/أقسام مخفية. يمكنك تفعيلها
      أو ترقية الخطة لإضافة المزيد.
    </div>

    <!-- 4️⃣ وجود أقسام مخفية بسبب تجاوز العدد الكلي للخطة -->
    <div
      v-else-if="hasHiddenDueToLimit"
      class="alert alert-warning text-center"
    >
      ⚠️ لديك أقسام مخفية حالياً بسبب تجاوز العدد الكلي للأقسام حد الخطة.
      <br />
      عدد الأقسام الكلي: <strong>{{ sections.length }}</strong> /
      {{ levelLimits.max_sections }}
      <br />
      لتتمكن من تفعيل باقي الأقسام، يُرجى ترقية الخطة.
    </div>

    <!-- ✅ جدول عرض الأقسام -->
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

    <div v-if="filteredSections.length">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center">الاسم</th>
            <th class="text-center">الوصف</th>
            <th class="text-center">صورة</th>
            <th class="text-center">الحالة</th>
            <th class="text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(sec, index) in filteredSections"
            :key="sec.se_id"
            :class="{ 'table-danger': sec.se_is_active == 0 }"
          >
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ sec.se_name }}</td>
            <td class="text-center">{{ sec.se_description }}</td>
            <td class="text-center">
              <img
                v-if="sec.se_image"
                :src="getImageUrl(sec.se_image)"
                alt="صورة القسم"
                width="40"
                height="40"
                onerror="this.style.display='none'"
              />
            </td>
            <td class="text-center">
              <button
                class="btn btn-sm w-50"
                :class="sec.se_is_active ? 'btn-success' : 'btn-danger'"
                @click="toggleStatus(sec)"
              >
                {{ sec.se_is_active ? "مفعل" : "مخفي" }}
              </button>
            </td>
            <td class="text-center">
              <router-link
                :to="`/client/sections/edit/${sec.se_id}`"
                class="btn btn-sm btn-warning w-50"
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
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
      levelLimits: {
        max_sections: 1000,
      },
    };
  },
  computed: {
    computed: {
      visibleSections() {
        return this.sections.filter((s) => s.se_is_active == 1);
      },
      hiddenSectionsCount() {
        return this.sections.filter((s) => s.se_is_active == 0).length;
      },
      exceededSectionsCount() {
        if (this.levelLimits.max_sections === "unlimited") return 0;
        return Math.max(
          0,
          this.visibleSections.length - this.levelLimits.max_sections
        );
      },
      limitExceeded() {
        return (
          this.levelLimits.max_sections !== "unlimited" &&
          this.visibleSections.length > this.levelLimits.max_sections
        );
      },
      limitReached() {
        return (
          this.levelLimits.max_sections !== "unlimited" &&
          this.visibleSections.length === this.levelLimits.max_sections &&
          this.sections.length === this.levelLimits.max_sections
        );
      },
      hasHiddenSections() {
        return (
          this.levelLimits.max_sections !== "unlimited" &&
          this.visibleSections.length < this.levelLimits.max_sections &&
          this.hiddenSectionsCount > 0 &&
          this.sections.length <= this.levelLimits.max_sections
        );
      },
      hasHiddenDueToLimit() {
        return (
          this.levelLimits.max_sections !== "unlimited" &&
          this.sections.length > this.levelLimits.max_sections &&
          this.visibleSections.length < this.levelLimits.max_sections
        );
      },
    },
    hasInactiveSections() {
      return this.inactiveSections.length > 0;
    },
  },
  methods: {
    getImageUrl(filename) {
      if (filename.startsWith("http")) return filename;
      return `${this.apiBaseUrl}/uploads/sections/${this.clientLinkCode}/${filename}`;
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
    await this.loadLimits();
    this.loadSections();
  },
};
</script>
