<template>
  <div class="container mt-4" style="max-width: 700px">
    <div class="card shadow-sm p-4">
      <h2 class="text-center mb-4">
        <i class="bi bi-info-circle me-2"></i> حول النشاط
      </h2>

      <div class="mb-3">
        <p class="lead">
          هذا النظام مصمم لإدارة المنيو الإلكتروني الخاص بنشاطك التجاري بطريقة
          سهلة وسريعة، ويتيح لك عرض الأصناف والأقسام للعملاء بشكل احترافي ومباشر
          من خلال رمز QR.
        </p>
      </div>

      <hr />

      <div class="mb-3">
        <h5><i class="bi bi-shop me-2"></i> اسم النشاط التجاري</h5>
        <p>{{ businessName }}</p>
      </div>

      <div class="mb-3" v-if="showLocation">
        <h5><i class="bi bi-geo-alt me-2"></i> الموقع</h5>
        <p>{{ businessLocation }}</p>
      </div>

      <div class="mb-3">
        <h5><i class="bi bi-telephone me-2"></i> رقم الهاتف</h5>
        <p>
          <a :href="`tel:${businessPhone}`">{{ businessPhone }}</a>
        </p>
      </div>

      <div class="mb-3">
        <h5><i class="bi bi-whatsapp me-2 text-success"></i> واتساب</h5>
        <p>
          <a
            :href="`https://wa.me/${businessPhone.replace('+', '')}`"
            target="_blank"
            class="text-success"
          >
            تواصل عبر واتساب
          </a>
        </p>
      </div>

      <div class="mb-3">
        <h5><i class="bi bi-envelope me-2"></i> البريد الإلكتروني</h5>
        <p>
          <a :href="`mailto:${businessEmail}`">{{ businessEmail }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClientAboutView",
  data() {
    return {
      businessName: "Tiklamu - للحلول البرمجية",
      businessLocation: "شارع فلسطين، بغداد - العراق",
      businessPhone: "009647834113500",
      businessEmail: "info@alhagree.com",
      showLocation: false, // أو true حسب
    };
  },
};
</script>
