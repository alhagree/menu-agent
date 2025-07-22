<template>
  <div class="dashboard">
    <!-- تنبيه الاشتراك المنتهي -->
    <div
      v-if="showExpiredMessage"
      class="alert alert-warning d-flex align-items-center mb-4 p-3"
    >
      <img
        src="/img/expired-warning.png"
        alt="تنبيه"
        class="me-3"
        style="height: 60px"
      />
      <div class="text-end">
        <strong>⚠️ لقد انتهت مدة الاشتراك منذ تاريخ:</strong><br />
        <span class="text-danger fw-bold">{{ subscriptionEnd }}</span>
        <p class="mb-0">
          سوف يبقى المنيو <strong>فعالاً</strong> لغاية
          <strong>{{ graceEndDate }}</strong
          >، بعدها سيتوقف تلقائيًا. يرجى التواصل مع الإدارة لضمان استمرارية
          الخدمة.
        </p>
      </div>
    </div>

    <!-- العنوان -->
    <h2 class="title">مرحباً بك من جديد يا {{ username }} 👋</h2>
    <p class="date">اليوم: {{ todayDate }}</p>

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
    };
  },
  computed: {
    todayDate() {
      return new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    statItems() {
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
          label: "تبقى على انتهاء الاشتراك",
          icon: "bi bi-hourglass-split",
          color: this.daysLeft <= 0 ? "bg-danger" : "bg-red",
          value: this.daysLeft !== null ? this.daysLeft + " يوم" : "--",
        },
      ];
    },
    graceEndDate() {
      if (!this.subscriptionEnd) return "غير متوفر";
      const end = new Date(this.subscriptionEnd);
      end.setDate(end.getDate() + 7);
      return end.toLocaleDateString("ar-EG");
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
  min-height: 100vh;
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
  align-items: center;
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
  margin-left: 15px;
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
</style>
