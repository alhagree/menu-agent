<template>
  <footer>
    <div class="footer-content">
      <img
        src="https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/small-logo.png?updatedAt=1753105833982"
        alt="TIKLAMU Logo"
        class="footer-logo me-2"
      />
      <span>TIKLAMU - Software Solution | © 2025 جميع الحقوق محفوظة</span>
    </div>
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
  text-align: center;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #555;
}

.footer-logo {
  height: 30px;
  object-fit: contain;
}
</style>
