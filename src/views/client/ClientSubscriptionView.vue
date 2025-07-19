<template>
  <div class="container mt-5 d-flex justify-content-center">
    <div
      class="card p-4 shadow-sm w-100 animate__animated animate__fadeIn subscription-card"
      style="max-width: 900px"
    >
      <!-- شريط حالة الاشتراك -->
      <div
        class="subscription-status-bar text-white fw-bold text-center py-2 rounded mb-4"
        :class="{
          'bg-success': subscription.su_status === 'active',
          'bg-danger': subscription.su_status === 'inactive',
        }"
      >
        حالة الاشتراك: {{ statusTextOnly }}
      </div>

      <div class="row">
        <!-- عمود الشعار -->
        <div class="col-md-4 d-flex justify-content-center align-items-center">
          <img
            v-if="subscription.st_logo"
            :src="`${apiBaseUrl}/uploads/settings/${link_code}/${subscription.st_logo}`"
            alt="شعار المشروع"
            class="img-fluid"
            style="max-width: 100%; width: 150px"
          />
        </div>

        <!-- عمود تفاصيل الاشتراك -->
        <div class="col-md-8">
          <h4 class="text-center mb-4">📝 تفاصيل الاشتراك</h4>

          <div
            v-for="(item, index) in infoItems"
            :key="index"
            class="d-flex justify-content-between align-items-center mb-3 px-2"
          >
            <div
              class="d-flex align-items-center flex-shrink-0"
              style="min-width: 250px"
            >
              <i :class="['me-2 fs-5', item.icon, item.iconColor]"></i>
              <span class="fw-bold">{{ item.label }}</span>
            </div>

            <div :class="['text-end flex-grow-1', item.color || 'text-muted']">
              <span v-if="item.isHtml" v-html="item.value"></span>
              <span v-else>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- الخلفية أسفل البطاقة -->
      <div v-if="subscription.st_background" class="mt-4 text-center">
        <h6 class="text-muted">صورة الخلفية</h6>
        <img
          :src="`${apiBaseUrl}/uploads/settings/${link_code}/${subscription.st_background}`"
          alt="الخلفية"
          class="img-fluid rounded"
          style="max-height: 200px"
        />
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
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL, // ✅
    };
  },
  computed: {
    infoItems() {
      return [
        {
          label: "اسم العميل ",
          value: this.subscription.cl_name || "—",
          icon: "bi bi-person-fill",
          iconColor: "text-primary",
        },
        {
          label: "رقم الهاتف ",
          value: this.subscription.cl_phone || "—",
          icon: "bi bi-telephone-fill",
          iconColor: "text-info",
        },
        {
          label: "نوع الاشتراك ",
          value: this.subscriptionTypeName,
          icon: "bi bi-box-seam",
          iconColor: "text-warning",
        },
        {
          label: "حالة الاشتراك ",
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
          label: "تاريخ البدء ",
          value: this.formatDate(this.subscription.su_start_date),
          icon: "bi bi-calendar-plus",
          iconColor: "text-success",
        },
        {
          label: "تاريخ الانتهاء ",
          value: this.formatDate(this.subscription.su_end_date),
          icon: "bi bi-calendar-x",
          iconColor: "text-danger",
        },
        {
          label: "المدة المتبقية ",
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
      } catch (err) {
        console.error("فشل تحميل بيانات الاشتراك", err);
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

.subscription-card {
  background: #f9f9f9;
  border-radius: 16px;
}

.subscription-status-bar {
  font-size: 1rem;
  border-radius: 8px;
}

@media (min-width: 768px) {
  .subscription-card .d-flex.justify-content-between {
    gap: 40px;
  }
}
</style>
