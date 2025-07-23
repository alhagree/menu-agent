<!-- components/CircleProgress.vue -->
<template>
  <div class="progress-circle-container">
    <svg class="progress-ring" width="100" height="100">
      <circle class="bg" :r="radius" :cx="center" :cy="center" />
      <circle
        class="progress"
        :r="radius"
        :cx="center"
        :cy="center"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
      <text
        class="progress-text"
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
      >
        {{ used }} / {{ total }}
      </text>
    </svg>
    <div class="label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  props: {
    used: Number,
    total: [Number, String],
    label: String,
  },
  computed: {
    percentage() {
      if (this.total === "unlimited") return 100;
      return Math.min((this.used / this.total) * 100, 100);
    },
    radius() {
      return 40;
    },
    center() {
      return 50;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    dashOffset() {
      return this.circumference * (1 - this.percentage / 100);
    },
  },
};
</script>

<style scoped>
.progress-circle-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 15px 10px;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: fadeSlideUp 0.7s ease;
  text-align: center;
  margin: auto;
}

svg.progress-ring {
  width: 60px;
  height: 60px;
  margin-bottom: 5px;
  transform: rotate(-90deg);
}

.bg {
  fill: none;
  stroke: #eee;
  stroke-width: 6;
}

.progress {
  fill: none;
  stroke: #2f80ed;
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-out;
}

.progress-text {
  fill: #2f80ed;
  font-size: 10px;
  transform: rotate(90deg); /* عكس الدوران العام */
  font-weight: bold;
}

.label {
  font-size: 13px;
  font-weight: bold;
  color: #333;
}

/* نفس حركة fadeSlideUp للبطاقات */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
