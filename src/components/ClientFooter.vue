<template>
  <footer>
    <a
      href="https://tiklamu.com"
      target="_blank"
      rel="noopener"
      class="footer-content"
    >
      <img
        src="https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/small-logo.png?updatedAt=1753105833982"
        alt="TIKLAMU Logo"
        class="footer-logo me-2"
      />
      <span class="text"
        >TIKLAMU - Software Solution | © 2025 جميع الحقوق محفوظة</span
      >
    </a>
  </footer>
</template>

<script>
export default {
  name: "ClientFooter",
};
</script>

<style scoped>
footer {
  width: 100%;
  height: 50px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #555;
  font-size: 0.9rem;
  direction: ltr; /* ✅ إجبار النص على اليسار لليمين */
}

.footer-logo {
  height: 30px;
  object-fit: contain;
}
</style>
