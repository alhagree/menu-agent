import { createRouter, createWebHistory } from "vue-router";
import ClientLoginView from "@/views/client/ClientLoginView.vue";
import ClientLayout from "@/components/ClientLayout.vue";

const routes = [
  {
    path: "/",
    name: "ClientLogin",
    component: ClientLoginView,
  },
  {
    path: "/client",
    component: ClientLayout,
    children: [
      {
        path: "",
        name: "ClientDashboard",
        component: () => import("@/views/client/ClientDashboardView.vue"),
      },
      {
        path: "sections",
        name: "ClientSections",
        component: () => import("@/views/client/ClientSectionsView.vue"),
      },
      {
        path: "/client/sections/add",
        component: () => import("@/views/client/SectionFormView.vue"),
      },
      {
        path: "/client/sections/edit/:id",
        component: () => import("@/views/client/SectionFormView.vue"),
      },
      {
        path: "items",
        name: "ClientItems",
        component: () => import("@/views/client/ClientItemsView.vue"),
      },
      {
        path: "/client/items/add",
        component: () => import("@/views/client/ClientItemFormView.vue"),
      },
      {
        path: "/client/items/edit/:id",
        name: "EditItem",
        component: () => import("@/views/client/ClientItemFormView.vue"),
      },
      {
        path: "subscription",
        name: "ClientSubscription",
        component: () => import("@/views/client/ClientSubscriptionView.vue"),
      },
      {
        path: "settings",
        name: "ClientSettings",
        component: () => import("@/views/client/ClientSettingsView.vue"),
      },
      {
        path: "about",
        name: "ClientAbout",
        component: () => import("@/views/client/ClientAboutView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ حماية المسارات
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("client_token");
  if (to.path.startsWith("/client") && !token) {
    return next("/");
  }
  next();
});

export default router;
