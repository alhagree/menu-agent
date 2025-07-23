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
    <h2 class="title">مرحباً بك من جديد يا {{ username }} 👋</h2>
    <p class="date">اليوم: {{ todayDate }}</p>

    <!-- مزايا الباقة -->
    <div class="plan-box mb-4">
      <div class="usage-bar" v-for="bar in usageBars" :key="bar.label">
        <div class="label-row">
          <span class="label">
            {{ bar.label }}: {{ bar.count }} / {{ bar.limit }} ({{
              bar.percent
            }}%)
          </span>
        </div>
        <div class="progress">
          <div
            class="progress-fill"
            :class="bar.color"
            :style="{ width: bar.fill + '%' }"
          ></div>
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
      sectionCount: 0,
      itemCount: 0,
      subscriptionEnd: null,
      daysLeft: null,
      showExpiredMessage: false,
      graceExpired: false,
      plan: {
        name: "",
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
      return [
        {
          label: "الأقسام",
          count: this.sectionCount,
          limit:
            this.plan.sectionLimit === "unlimited"
              ? "غير محدود"
              : this.plan.sectionLimit,
          percent:
            this.plan.sectionLimit === "unlimited"
              ? 100
              : Math.round((this.sectionCount / this.plan.sectionLimit) * 100),
          fill: this.sectionFillWidth,
          color: "bg-primary",
        },
        {
          label: "الأصناف",
          count: this.itemCount,
          limit:
            this.plan.itemLimit === "unlimited"
              ? "غير محدود"
              : this.plan.itemLimit,
          percent:
            this.plan.itemLimit === "unlimited"
              ? 100
              : Math.round((this.itemCount / this.plan.itemLimit) * 100),
          fill: this.itemFillWidth,
          color: "bg-success",
        },
      ];
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

.plan-box {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.plan-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}

.plan-features-row {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  font-size: 14px;
  margin-bottom: 15px;
}

.usage-bar {
  margin-bottom: 15px;
}

.usage-bar .label {
  font-size: 13px;
  margin-bottom: 5px;
}

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

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 5px;
}
</style>
