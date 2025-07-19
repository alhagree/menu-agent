<template>
  <div class="bg-white rounded-xl shadow p-4">
    <h3 class="text-lg font-semibold mb-2">عدد الزيارات خلال الأسبوع</h3>
    <line-chart :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import api from "@/axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "VisitChart",
  components: { LineChart: Line },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: "عدد الزيارات",
            data: [],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    };
  },
  async mounted() {
    try {
      const res = await api.get("/visits/weekly");
      this.chartData.labels = res.data.map((v) => v.label);
      this.chartData.datasets[0].data = res.data.map((v) => v.count);
    } catch (err) {
      console.error("فشل تحميل بيانات الزيارات:", err);
    }
  },
};
</script>

<style scoped>
div {
  height: 300px;
}
</style>
