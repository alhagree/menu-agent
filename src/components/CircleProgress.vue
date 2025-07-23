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
  display: flex;
  flex-direction: column;
  align-items: center;
}
.progress-ring {
  transform: rotate(-90deg);
}
.bg {
  fill: none;
  stroke: #eee;
  stroke-width: 8;
}
.progress {
  fill: none;
  stroke: #3498db;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-out;
}
.progress-text {
  fill: #222;
  font-size: 14px;
  transform: rotate(90deg); /* لإلغاء الدوران العام */
}
.label {
  margin-top: 10px;
  font-weight: bold;
  color: #444;
}

svg.progress-ring {
  width: 80px;
  height: 80px;
}
</style>
