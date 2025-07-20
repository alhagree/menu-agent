<!-- App.vue -->
<template>
  <router-view />
  <AppToast ref="toastRef" />
</template>

<script>
import AppToast from "@/components/base/AppToast.vue";

export default {
  components: { AppToast },
  provide() {
    return {
      showToast: this.showToast,
    };
  },
  methods: {
    showToast(message, type = "success") {
      this.$refs.toastRef.show(message, type);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
