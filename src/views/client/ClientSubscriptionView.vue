<template>
  <div class="container mt-5 d-flex justify-content-center">
    <div
      class="card p-4 shadow-sm w-100 animate__animated animate__fadeIn subscription-card"
      style="max-width: 900px"
    >
      <!-- 🔹 شريط حالة الاشتراك -->
      <div
        class="subscription-status-bar text-white fw-bold text-center py-2 rounded mb-4"
        :class="{
          'bg-success': subscription.su_status === 'active',
          'bg-danger': subscription.su_status === 'inactive',
        }"
      >
        حالة الاشتراك: {{ statusTextOnly }}
      </div>

      <!-- 🔹 الشعار -->
      <div class="text-center mb-4">
        <img
          v-if="subscription.st_logo"
          :src="subscription.st_logo"
          alt="شعار المشروع"
          class="img-fluid rounded"
          style="max-width: 150px"
        />
      </div>

      <!-- 🔹 جدول معلومات الاشتراك -->
      <div class="row mb-4">
        <div class="col-md-6" v-for="(item, index) in infoItems" :key="index">
          <div
            class="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <div class="fw-bold">
              <i :class="['me-2', item.icon, item.iconColor]"></i
              >{{ item.label }}
            </div>
            <div :class="['text-end', item.color || 'text-muted']">
              <span v-if="item.isHtml" v-html="item.value"></span>
              <span v-else>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 🔹 تفاصيل خطة الاشتراك -->
      <div v-if="subscription.level_name" class="mb-4">
        <h5 class="text-center mb-3">📦 {{ subscription.level_name }}</h5>
        <p class="text-center text-muted mb-4">
          {{ subscription.level_description }}
        </p>

        <!-- الأقسام -->
        <div class="mb-3">
          <strong>الأقسام:</strong>
          <div class="d-flex justify-content-between">
            <span
              >{{ subscription.section_count }} /
              {{ subscription.level_max_sections }}</span
            >
            <span>{{ sectionUsagePercent }}%</span>
          </div>
          <div class="progress overflow-hidden position-relative">
            <div
              class="progress-bar bg-info"
              role="progressbar"
              :style="{ width: sectionProgressWidth + '%' }"
            ></div>
          </div>
          <div
            v-if="showSectionLimitWarning"
            class="text-danger mt-1 d-flex align-items-center"
            style="font-size: 0.9rem"
          >
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            لقد تجاوزت الحد المسموح من الأقسام.
          </div>
        </div>

        <!-- الأصناف -->
        <div class="mb-3">
          <strong>الأصناف:</strong>
          <div class="d-flex justify-content-between">
            <span
              >{{ subscription.item_count }} /
              {{ subscription.level_max_items }}</span
            >
            <span>{{ itemUsagePercent }}%</span>
          </div>
          <div class="progress overflow-hidden position-relative">
            <div
              class="progress-bar bg-success"
              role="progressbar"
              :style="{ width: itemProgressWidth + '%' }"
            ></div>
          </div>
          <div
            v-if="showItemLimitWarning"
            class="text-danger mt-1 d-flex align-items-center"
            style="font-size: 0.9rem"
          >
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            لقد تجاوزت الحد المسموح من الأصناف.
          </div>
        </div>

        <!-- المزايا -->
        <div class="row text-center mt-4">
          <div class="col-md-6 mb-2">
            لوحة التحكم:
            <i
              :class="
                subscription.level_has_dashboard
                  ? 'bi bi-check-circle-fill text-success'
                  : 'bi bi-x-circle-fill text-danger'
              "
            ></i>
          </div>
          <div class="col-md-6 mb-2">
            تخصيص الشعار والخلفية:
            <i
              :class="
                subscription.level_can_customize
                  ? 'bi bi-check-circle-fill text-success'
                  : 'bi bi-x-circle-fill text-danger'
              "
            ></i>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-warning text-center mt-4">
        لم يتم تحديد خطة اشتراك بعد.
      </div>

      <!-- 🔹 رمز QR -->
      <div v-if="subscription.st_barcode" class="barcode-box">
        <h5 class="text-center">رمز QR الخاص بك</h5>
        <img :src="subscription.st_barcode" alt="QR Code" class="qr-image" />
        <p class="text-center text-primary fw-bold mt-2">
          يمكنك تحميله وطباعته واستخدامه للعرض السريع.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";

export default {
  name: "ClientSubscriptionView",
  data() {
    return {
      subscription: {},
      link_code: localStorage.getItem("client_link_code") || "",
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
      sectionProgressWidth: 0,
      itemProgressWidth: 0,
    };
  },
  computed: {
    infoItems() {
      return [
        {
          label: "اسم العميل",
          value: this.subscription.cl_name || "—",
          icon: "bi bi-person-fill",
          iconColor: "text-primary",
        },
        {
          label: "رقم الهاتف",
          value: this.subscription.cl_phone || "—",
          icon: "bi bi-telephone-fill",
          iconColor: "text-info",
        },
        {
          label: "نوع الاشتراك",
          value: this.subscriptionTypeName,
          icon: "bi bi-box-seam",
          iconColor: "text-warning",
        },
        {
          label: "حالة الاشتراك",
          value: this.statusIconText,
          icon: "bi bi-info-circle-fill",
          iconColor: "text-dark",
          color:
            this.subscription.su_status === "active"
              ? "text-success fw-bold"
              : "text-danger fw-bold",
          isHtml: true,
        },
        {
          label: "تاريخ البدء",
          value: this.formatDate(this.subscription.su_start_date),
          icon: "bi bi-calendar-plus",
          iconColor: "text-success",
        },
        {
          label: "تاريخ الانتهاء",
          value: this.formatDate(this.subscription.su_end_date),
          icon: "bi bi-calendar-x",
          iconColor: "text-danger",
        },
        {
          label: "المدة المتبقية",
          value:
            this.subscription.days_remaining >= 0
              ? `${this.subscription.days_remaining} يوم`
              : "انتهى الاشتراك",
          icon: "bi bi-hourglass-split",
          iconColor: "text-secondary",
          color:
            this.subscription.days_remaining >= 0 ? "" : "text-danger fw-bold",
        },
      ];
    },
    subscriptionTypeName() {
      const map = {
        trial: "تجريبي (7 أيام)",
        first: "أول اشتراك",
        renew: "تجديد",
      };
      return map[this.subscription.su_type] || "غير معروف";
    },

    statusIconText() {
      const status = this.subscription.su_status;
      if (status === "active")
        return `<i class='bi bi-check-circle-fill me-1'></i> فعال`;
      if (status === "inactive")
        return `<i class='bi bi-x-circle-fill me-1'></i> غير فعال`;
      return `<i class='bi bi-question-circle-fill me-1'></i> غير معروف`;
    },
    statusTextOnly() {
      const status = this.subscription.su_status;
      if (status === "active") return "فعال";
      if (status === "inactive") return "غير فعال";
      return "غير معروف";
    },
    sectionUsagePercent() {
      const used = this.subscription.section_count || 0;
      const max = this.subscription.level_max_sections || 0;
      return max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;
    },
    itemUsagePercent() {
      const used = this.subscription.item_count || 0;
      const max = this.subscription.level_max_items || 0;
      return max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;
    },
    showSectionLimitWarning() {
      return (
        this.subscription.level_max_sections > 0 &&
        this.subscription.section_count > this.subscription.level_max_sections
      );
    },
    showItemLimitWarning() {
      return (
        this.subscription.level_max_items > 0 &&
        this.subscription.item_count > this.subscription.level_max_items
      );
    },
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "—";
      return dayjs(dateStr).format("YYYY-MM-DD");
    },
    async loadSubscription() {
      try {
        const token = localStorage.getItem("client_token");
        const res = await axios.get(
          `${this.apiBaseUrl}/api/agent/settings/subscription`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.subscription = res.data;
        setTimeout(() => {
          this.sectionProgressWidth = this.sectionUsagePercent;
          this.itemProgressWidth = this.itemUsagePercent;
        }, 100);
      } catch (err) {
        console.error(
          "❌ فشل تحميل بيانات الاشتراك:",
          err?.response?.data || err.message || err
        );
      }
    },
  },
  mounted() {
    this.loadSubscription();
  },
};
</script>

<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";

/************************ */

.subscription-card {
  background: #f9f9f9;
  border-radius: 16px;
}

.subscription-status-bar {
  font-size: 1rem;
  border-radius: 8px;
}

.barcode-box {
  text-align: center;
  margin-top: 30px;
}

.qr-image {
  width: 220px;
  height: auto;
  margin-bottom: 10px;
  border: 1px dashed #ccc;
  padding: 10px;
  background: white;
}

@keyframes slideIn {
  to {
    transform: translateX(0);
  }
}
.progress-bar {
  transition: width 1.2s ease-in-out;
}
</style>
