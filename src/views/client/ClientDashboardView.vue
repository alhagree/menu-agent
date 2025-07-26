<template>
  <div class="dashboard">
    <!-- تنبيه الاشتراك المنتهي -->
    <div
      v-if="showExpiredMessage"
      class="alert alert-warning mb-4 p-3 text-end"
      style="font-size: 1rem"
    >
      <template v-if="!graceExpired">
        <strong class="d-block mb-2"
          >⚠️ لقد انتهت مدة الاشتراك منذ تاريخ :
          <span class="text-danger fw-bold">{{
            arabicDate(subscriptionEnd)
          }}</span>
        </strong>
        <span></span>
        <span>سوف يبقى المنيو <strong>فعالاً</strong> لغاية</span>
        <strong class="text-dark">{{ arabicDate(graceEndDateRaw) }}</strong>
        <span>، بعدها سيتوقف تلقائيًا.</span><br />
        <span class="text-muted"
          >يرجى التواصل مع الإدارة لضمان استمرارية الخدمة.</span
        >
      </template>

      <template v-else>
        <strong class="d-block mb-2 text-danger"
          >⛔ تم إيقاف المنيو بتاريخ :
          <span class="fw-bold text-danger">{{
            arabicDate(graceEndDateRaw)
          }}</span>
        </strong>
        <span></span>
        <span>انتهت مدة الاشتراك ولم يتم التجديد خلال المهلة المحددة.</span
        ><br />
        <span class="text-muted">يرجى التجديد لإعادة تفعيل المنيو.</span>
      </template>
    </div>

    <!-- العنوان -->
    <h2 class="title">
      مرحباً بك من جديد 👋 يا <b>{{ fullname }} </b>
    </h2>
    <h2 class="title">
      في ادارة منيو مشروعك <b>{{ username }}</b>
    </h2>
    <p class="date">اليوم: {{ todayDate }}</p>

    <!-- بطاقة معلومات الخطة النشطة -->
    <div :class="['plan-active-box', getPlanClass(plan.code)]" class="mb-4">
      <div class="d-flex flex-column align-items-center gap-2 text-center">
        <div class="d-flex align-items-center gap-2 justify-content-center">
          <i class="bi bi-clipboard2-check-fill text-primary fs-5"></i>
          <h5 class="m-0 fw-bold text-primary">
            الخطة الحالية: {{ plan.name || "غير محددة" }}
          </h5>
        </div>

        <div class="d-flex flex-column flex-md-row align-items-center gap-2">
          <span class="text-secondary">
            {{ plan.description || "بدون قيود على الأقسام أو الأصناف." }}
          </span>

          <router-link
            to="/client/subscription"
            class="btn btn-sm btn-outline-primary"
            style="white-space: nowrap"
          >
            <i class="bi bi-info-circle me-1"></i>
            تفاصيل الاشتراك
          </router-link>
        </div>
      </div>
    </div>

    <!-- مزايا الباقة -->
    <div class="plan-usage-row mb-4">
      <div v-for="bar in usageBars" :key="bar.label" class="usage-box">
        <div class="usage-header">
          {{ bar.label }}: {{ bar.count }} / {{ bar.limit }}
          <template v-if="bar.limit !== 'غير محدود'"
            >({{ bar.percent }}%)</template
          >
        </div>

        <div class="progress">
          <div
            class="progress-fill"
            :class="bar.color"
            :style="{ width: bar.fill + '%' }"
          ></div>
        </div>

        <div class="limit-warning text-danger fw-bold mt-1" v-if="bar.exceeded">
          🚫 تجاوزت الحد المسموح
        </div>
      </div>
    </div>

    <!-- الإحصائيات -->
    <div class="stats-grid">
      <div v-for="item in statItems" :key="item.key" class="stat-card">
        <div :class="['icon', item.color]">
          <i :class="item.icon"></i>
        </div>
        <div class="content">
          <h4>{{ item.label }}</h4>
          <p>{{ item.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../axios";

export default {
  name: "ClientDashboardView",
  data() {
    return {
      username: null,
      fullname: null,
      sectionCount: 0,
      itemCount: 0,
      subscriptionEnd: null,
      daysLeft: null,
      showExpiredMessage: false,
      graceExpired: false,
      plan: {
        name: "",
        description: "",
        sectionLimit: 0,
        itemLimit: 0,
        hasDashboard: false,
        hasLogo: false,
      },
      sectionFillWidth: 0,
      itemFillWidth: 0,
    };
  },
  computed: {
    graceEndDateRaw() {
      if (!this.subscriptionEnd) return null;
      const end = new Date(this.subscriptionEnd);
      end.setDate(end.getDate() + 7);
      return end;
    },
    todayDate() {
      return new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    statItems() {
      const days = this.daysLeft;
      const isExpired = days < 0;
      const isTodayLast = days === 0;
      const isActive = days > 0;

      return [
        {
          key: "sectionCount",
          label: "عدد الأقسام",
          icon: "bi bi-collection",
          color: "bg-blue",
          value: this.sectionCount,
        },
        {
          key: "itemCount",
          label: "عدد الأصناف",
          icon: "bi bi-basket2",
          color: "bg-green",
          value: this.itemCount,
        },
        {
          key: "subscriptionEnd",
          label: "تاريخ انتهاء الاشتراك",
          icon: "bi bi-calendar-event",
          color: "bg-orange",
          value: this.subscriptionEnd || "غير متوفر",
        },
        {
          key: "daysLeft",
          label: isActive
            ? "تبقى على انتهاء الاشتراك"
            : isTodayLast
            ? "اليوم هو آخر يوم للاشتراك"
            : "لقد مضى على انتهاء اشتراكك",
          icon: isActive
            ? "bi bi-hourglass-split"
            : isTodayLast
            ? "bi bi-exclamation-triangle"
            : "bi bi-x-octagon",
          color: isActive
            ? "bg-red"
            : isTodayLast
            ? "bg-warning"
            : "bg-dark expired-alert", // ← فقط في حال انتهى الاشتراك تمامًا
          value: days !== null ? (isExpired ? days * -1 : days) + " يوم" : "--",
        },
      ];
    },
    usageBars() {
      const bars = [];

      const sectionLimit = this.plan.sectionLimit;
      const itemLimit = this.plan.itemLimit;

      const sectionPercent =
        sectionLimit === "unlimited"
          ? 100
          : Math.round((this.sectionCount / sectionLimit) * 100);
      const itemPercent =
        itemLimit === "unlimited"
          ? 100
          : Math.round((this.itemCount / itemLimit) * 100);

      bars.push({
        label: "الأقسام",
        count: this.sectionCount,
        limit: sectionLimit === "unlimited" ? "غير محدود" : sectionLimit,
        percent: sectionPercent,
        fill: Math.min(100, sectionPercent),
        color: sectionPercent > 100 ? "bg-danger" : "bg-primary",
        exceeded: sectionLimit !== "unlimited" && sectionPercent > 100,
      });

      bars.push({
        label: "الأصناف",
        count: this.itemCount,
        limit: itemLimit === "unlimited" ? "غير محدود" : itemLimit,
        percent: itemPercent,
        fill: Math.min(100, itemPercent),
        color: itemPercent > 100 ? "bg-danger" : "bg-success",
        exceeded: itemLimit !== "unlimited" && itemPercent > 100,
      });

      return bars;
    },

    sectionProgress() {
      if (this.plan.sectionLimit === "unlimited") return 100;
      return Math.min(
        100,
        Math.round((this.sectionCount / this.plan.sectionLimit) * 100)
      );
    },
    itemProgress() {
      if (this.plan.itemLimit === "unlimited") return 100;
      return Math.min(
        100,
        Math.round((this.itemCount / this.plan.itemLimit) * 100)
      );
    },
  },
  methods: {
    getPlanClass(code) {
      switch (code) {
        case "begin":
          return "plan-begin";
        case "basic":
          return "plan-basic";
        case "advanced":
          return "plan-advanced";
        case "elite":
          return "plan-elite";
        default:
          return "plan-begin";
      }
    },
    arabicDate(date) {
      if (!date) return "غير متوفر";
      const d = new Date(date);
      return d.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  async mounted() {
    try {
      const res = await api.get("/dashboard");
      this.username = res.data.username;
      this.fullname = res.data.fullname;
      this.sectionCount = res.data.sectionCount;
      this.itemCount = res.data.itemCount;
      this.subscriptionEnd = res.data.subscriptionEnd;
      this.daysLeft = res.data.daysLeft;
      this.showExpiredMessage = res.data.subscriptionExpired;
      this.graceExpired = this.daysLeft < -7; // تجاوز 7 أيام بعد الانتهاء
      this.plan = res.data.level;

      // ✅ تشغيل الأنميشن بعد تحميل البيانات
      setTimeout(() => {
        this.sectionFillWidth = this.sectionProgress;
        this.itemFillWidth = this.itemProgress;
      }, 100);
    } catch (err) {
      console.error("فشل تحميل البيانات:", err);
    }
  },
};
</script>

<style>
.dashboard {
  padding: 30px;
  background: #f4f6f8;
  min-height: calc(100vh - 60px); /* خصم الشريط العلوي إن وجد */
  overflow-x: hidden;
  overflow-y: auto;
}

.title {
  font-size: 24px;
  margin-bottom: 5px;
}

.date {
  color: #666;
  margin-bottom: 25px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column; /* ← عمودي */
  align-items: center;
  justify-content: center; /* ← توسيط عمودي */
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px; /* بدلًا من margin-left */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.bg-blue {
  background: #2f80ed;
}
.bg-green {
  background: #27ae60;
}
.bg-orange {
  background: #f2994a;
}
.bg-red {
  background: #e74c3c;
}
.bg-danger {
  background: #b71c1c;
}

.content h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.content p {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #111;
}

.expired-alert {
  animation: pulseBlink 1.2s infinite;
  box-shadow: 0 0 12px #b71c1c;
}

@keyframes pulseBlink {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.03);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 576px) {
  .dashboard {
    padding: 15px;
  }
}
/************************** */

.progress {
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 0;
  transform-origin: right;
  transition: width 1.5s ease-in-out;
}

/******************** */

.plan-usage-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.usage-box {
  flex: 1;
  min-width: 260px;
  background: #fff;
  border-radius: 12px;
  padding: 15px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.usage-header {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

.progress {
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 1.5s ease-in-out;
}

.limit-warning {
  font-size: 13px;
  text-align: center;
}

.plan-active-box {
  border-radius: 16px;
  padding: 20px 25px;
  text-align: center;
  transition: all 0.3s ease-in-out;
  background-color: #ffffff; /* رمادي فاتح مريح */
  color: #495057; /* رمادي غامق للنص */
}

/* 🧪 خطة تجريبية – ألوان هادئة */
.plan-begin {
  color: #495057; /* رمادي غامق للنص */
}

.plan-basic {
  color: #0d47a1; /* أزرق داكن للنص */
}

/* 🚀 خطة متقدمة – ألوان خضراء دافعة للنجاح */
.plan-advanced {
  color: #1b5e20; /* أخضر داكن */
}

/* 👑 خطة النخبة – فخامة وتميز */
.plan-elite {
  color: #6d4c41; /* بني فخم */
}
</style>
