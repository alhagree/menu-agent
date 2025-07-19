<template>
  <div
    class="bg-white p-4 rounded shadow flex flex-col items-center text-center"
  >
    <h3 class="text-lg font-bold mb-2">الطقس</h3>
    <div v-if="weather">
      <p class="text-xl">{{ weather.temp }}°C</p>
      <p class="capitalize">{{ weather.description }}</p>
    </div>
    <div v-else>
      <p>جارٍ تحميل الطقس...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeatherWidget",
  data() {
    return {
      weather: null,
    };
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ar&appid=${apiKey}`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          this.weather = {
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
          };
        } catch (err) {
          console.error("فشل تحميل الطقس:", err);
        }
      });
    }
  },
};
</script>

<style scoped></style>
