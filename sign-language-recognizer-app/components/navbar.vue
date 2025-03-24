<template>
  <v-app-bar app color="black" dark>
    <!-- Menu Button (Mobile) -->
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>

    <!-- Logo -->
    <v-img
      class="mx-2"
      src="assets/logo.png"
      max-height="80"
      max-width="80"
      contain
      @click="navigateTo('/')"
    />

    <!-- Title -->
    <v-toolbar-title>Sign-Language Translator</v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Navigation Links (Desktop) -->
    <div class="d-none d-md-flex">
      <v-btn @click="navigateTo('/translation')">Translate</v-btn>
      <v-btn @click="navigateTo('/community/dashboard')">Community</v-btn>
      <v-btn @click="navigateTo('/contact')">Contact</v-btn>
      <v-btn @click="navigateTo('/resources')">Resources</v-btn>
    </div>

    <!-- Authentication Buttons -->
    <div v-if="!authStore.user">
      <v-btn @click="uiStore.showLoginDialog()">Login</v-btn>
      <v-btn @click="navigateTo('/register')">Register</v-btn>
    </div>

    <!-- User Dropdown Menu -->
    <div v-if="authStore.user">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" prepend-icon="mdi-account">
            {{ authStore.user.username || "User" }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="navigateTo(`/profile/${authStore.user.id}`)">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="loggingOut">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>

  <!-- Login Dialog -->
  <v-dialog v-model="uiStore.loginDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5 font-bold text-white bg-gray-900 text-center">Login</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="loginEmail" label="Email" type="email" outlined required></v-text-field>
          <v-text-field v-model="loginPassword" label="Password" type="password" outlined required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <p class="text-sm">Don't have an account?</p>
        <NuxtLink class="text-sm underline" to="/register" @click="uiStore.hideLoginDialog()">Sign Up</NuxtLink>
        <v-spacer></v-spacer>
        <v-btn color="black" variant="text" @click="loginUser">Login</v-btn>
        <v-btn outlined @click="uiStore.hideLoginDialog()">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Navigation Drawer (Mobile) -->
  <v-navigation-drawer v-model="drawer" app temporary theme="dark">
    <v-list>
      <v-list-item prepend-icon="mdi-home" title="Home" @click="navigateTo('/')"></v-list-item>
      <v-list-item prepend-icon="mdi-brain" title="Translation" @click="navigateTo('/translation')"></v-list-item>
      <v-list-item prepend-icon="mdi-post-outline" title="Community" @click="navigateTo('/community/dashboard')"></v-list-item>
      <v-list-item prepend-icon="mdi-information" title="Resources" @click="navigateTo('/resources')"></v-list-item>
      <v-list-item prepend-icon="mdi-card-account-phone" title="Contact" @click="navigateTo('/contact')"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

const drawer = ref(false);
// const loginDialog = ref(false);
const loginEmail = ref("");
const loginPassword = ref("");

const authStore = useAuthStore();
const uiStore = useUIStore();

const loginUser = async () => {
  if (!loginEmail.value || !loginPassword.value) {
    alert("Please fill in all fields.");
    return;
  }
  await authStore.login(loginEmail.value, loginPassword.value);
  if (authStore.user) uiStore.hideLoginDialog();
};

const loggingOut = async () => {
  authStore.logout();
  navigateTo('/')
}
</script>

<style scoped>

</style>
