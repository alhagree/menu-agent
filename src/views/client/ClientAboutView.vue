<template>
  <div class="container mt-4" style="max-width: 700px">
    <div class="card shadow-sm p-4">
      <!-- ✅ الشعار -->
      <div class="text-center mb-3">
        <img
          src="https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/logo.png"
          alt="Tiklamu Logo"
          style="width: 100px; height: 100px"
        />
      </div>

      <!-- عنوان -->
      <h3 class="text-center mb-4 fw-bold">
        <i class="bi bi-info-circle me-2"></i> حول النظام
      </h3>

      <!-- وصف النظام -->
      <p class="text-center" style="font-size: 1rem">
        هذا النظام مصمم لإدارة المنيو الإلكتروني الخاص بنشاطك التجاري بطريقة
        سهلة وسريعة، ويتيح لك عرض الأصناف والأقسام للعملاء بشكل احترافي ومباشر
        من خلال رمز QR.
      </p>

      <hr />

      <!-- معلومات النشاط -->
      <div class="row text-center mb-4">
        <div class="col-md-12">
          <p class="fw-bold text-primary fs-5">{{ businessName }}</p>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-6 text-center">
          <h6><i class="bi bi-telephone me-1"></i> رقم الهاتف</h6>
          <a
            :href="`tel:${businessPhone}`"
            class="d-block text-decoration-none text-dark fw-bold"
          >
            {{ businessPhone }}
          </a>
        </div>
        <div class="col-md-6 text-center">
          <h6><i class="bi bi-whatsapp me-1 text-success"></i> واتساب</h6>
          <a
            :href="`https://wa.me/${businessPhone.replace('+', '')}`"
            target="_blank"
            class="text-success fw-bold text-decoration-none"
          >
            تواصل عبر واتساب
          </a>
        </div>
        <div class="col-md-6 text-center">
          <h6><i class="bi bi-envelope me-1"></i> البريد الإلكتروني</h6>
          <a :href="`mailto:${businessEmail}`" class="d-block fw-bold">
            {{ businessEmail }}
          </a>
        </div>
        <div class="col-md-6 text-center" v-if="showLocation">
          <h6><i class="bi bi-geo-alt me-1"></i> الموقع</h6>
          <p class="fw-bold text-muted">{{ businessLocation }}</p>
        </div>
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
      showLocation: false,
    };
  },
};
</script>
