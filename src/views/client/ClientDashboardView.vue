<template>
  <div class="dashboard">
    <h2 class="title">مرحباً بك من جديد يا {{ username }} 👋</h2>
    <p class="date">اليوم: {{ todayDate }}</p>

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
import api from "../../axios"; // ← التعديل هنا فقط

export default {
  name: "ClientDashboardView",
  data() {
    return {
      username: null,
      sectionCount: 0,
      itemCount: 0,
      subscriptionEnd: null,
      daysLeft: null,
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
          color: "bg-red",
          value: this.daysLeft !== null ? this.daysLeft + " يوم" : "--",
        },
      ];
    },
  },
  async mounted() {
    try {
      const res = await api.get("/dashboard");
      this.username = res.data.username;
      this.sectionCount = res.data.sectionCount;
      this.itemCount = res.data.itemCount;
      this.subscriptionEnd = res.data.subscriptionEnd;

      if (this.subscriptionEnd) {
        const endDate = new Date(this.subscriptionEnd);
        const now = new Date();
        const diffTime = endDate - now;
        this.daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
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
