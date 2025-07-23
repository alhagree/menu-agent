import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import CircleProgress from "vue3-circle-progress";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap";
import "./assets/styles/main.css";

// ✅ أنشئ التطبيق أولًا
const app = createApp(App);

// ✅ ثم استخدم المكتبات
app.use(store);
app.use(router);
app.use(CircleProgress);

// ✅ ثم ابدأ التطبيق
app.mount("#app");
