import { defineNuxtRouteMiddleware } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui"; 

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  const authRoutes = ["resources", "contact", "index", "register"];

  if (!authStore.isAuthenticated && !authRoutes.includes(to.name as string)) {
    uiStore.showLoginDialog();
    return false;
  }
});
