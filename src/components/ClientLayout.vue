<template>
  <div class="client-layout">
    <ClientSidebar />
    <main class="client-main">
      <ClientTopbar />
      <!-- ✅ شريط علوي جديد -->
      <router-view />
    </main>
  </div>
</template>

<script>
import ClientSidebar from "./ClientSidebar.vue";
import ClientTopbar from "./ClientTopbar.vue";

export default {
  name: "ClientLayout",
  components: {
    ClientSidebar,
    ClientTopbar,
  },
};
</script>

<style scoped>
.client-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.client-main {
  flex: 1;
  background: #f9f9f9;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

nav.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
