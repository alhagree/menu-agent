// ClientSectionsView.vue
<template>
  <div class="container mt-4">
    <div class="header mb-3 d-flex justify-content-between align-items-center">
      <h2>الأقسام</h2>
      <router-link to="/client/sections/add" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i> إضافة قسم
      </router-link>
    </div>

    <!-- تنبيه عند تجاوز عدد الأقسام الفعالة للحد -->
    <!-- حالة التحميل -->
    <div
      v-if="sectionLimitStatus === 'loading'"
      class="alert alert-info text-center"
    >
      ⏳ جاري تحميل بيانات الأقسام وحدود الخطة...
    </div>

    <div
      v-if="sectionLimitStatus === 'exceededActive'"
      class="alert alert-warning text-center"
    >
      ⚠️ لقد تجاوزت الحد المسموح به للأقسام الفعالة في خطتك.
      <br />
      حالياً لديك <strong>{{ visibleSections.length }}</strong> قسم مفعّل،
      والخطة تسمح بـ <strong>{{ levelLimits.max_sections }}</strong> كحد أقصى.
      <br />
      سيتم
      <strong class="text-danger">إخفاء {{ exceededSectionsCount }}</strong>
      قسم/أقسام تلقائيًا في المنيو.
      <br />
      يُنصح بإخفاء بعض الأقسام يدويًا أو ترقية خطتك.
    </div>

    <!-- تنبيه عند وجود أقسام غير مفعّلة لأن العدد الكلي أكبر من الحد -->
    <div
      v-else-if="sectionLimitStatus === 'hiddenDueToLimit'"
      class="alert alert-info text-center"
    >
      ℹ️ عدد الأقسام المفعّلة حالياً هو
      <strong>{{ visibleSections.length }}</strong> من أصل
      <strong>{{ totalSectionsCount }}</strong> قسم.
      <br />
      خطتك تسمح بـ <strong>{{ levelLimits.max_sections }}</strong> قسم مفعّل
      فقط.
      <br />
      يوجد <strong>{{ inactiveSections.length }}</strong> قسم/أقسام غير مفعّلة
      حالياً، يمكنك إخفاء قسم فعّال لإظهار أحدهم، أو ترقية خطتك.
    </div>

    <!-- لا تنبيه إذا كل شيء ضمن الحد -->
    <div
      v-else-if="sectionLimitStatus === 'withinLimit'"
      class="alert alert-success text-center"
    >
      ✅ جميع الأقسام الحالية ضمن الحد المسموح لخطة اشتراكك.
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
    <div v-if="filteredSections && filteredSections.length">
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
      return (this.sections || []).filter((s) => s.se_is_active == 1);
    },
    inactiveSections() {
      return (this.sections || []).filter((s) => s.se_is_active == 0);
    },
    totalSectionsCount() {
      return (this.sections || []).length;
    },
    exceededSectionsCount() {
      if (this.levelLimits.max_sections === "unlimited") return 0;
      return Math.max(
        0,
        this.visibleSections.length - this.levelLimits.max_sections
      );
    },
    sectionLimitStatus() {
      const limit = this.levelLimits.max_sections;

      // لا حساب إذا لم يتم تحميل الأقسام بعد
      if (!this.sections || this.sections.length === 0) return "loading";

      const active = this.visibleSections.length;
      const inactive = this.inactiveSections.length;
      const total = active + inactive;

      if (limit === "unlimited") return "unlimited";
      if (total <= limit) return "withinLimit";
      if (active > limit) return "exceededActive";
      if (active <= limit && inactive > 0) return "hiddenDueToLimit";

      return "other";
    },
    filteredSections() {
      return (this.sections || []).filter((sec) => {
        const matchesSearch = sec.se_name
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase());
        const matchesStatus =
          this.filterStatus === "" || sec.se_is_active == this.filterStatus;
        return matchesSearch && matchesStatus;
      });
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

        const level = response.data?.level || {}; // ← حتى لو undefined يصير كائن فارغ
        const sectionLimit = level.sectionLimit;

        if (
          !sectionLimit ||
          sectionLimit === "غير محدود" ||
          sectionLimit === "unlimited"
        ) {
          this.levelLimits.max_sections = "unlimited";
        } else {
          this.levelLimits.max_sections = parseInt(sectionLimit);
        }
      } catch (err) {
        console.error("فشل في جلب حدود الخطة:", err);
        this.levelLimits.max_sections = "unlimited"; // ← fallback افتراضي
      }
    },
    resetFilters() {
      this.searchTerm = "";
      this.filterStatus = "";
    },
  },
  async mounted() {
    await this.loadLimits();
    await this.loadSections();
  },
};
</script>
