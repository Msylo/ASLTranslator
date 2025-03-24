<template>
    <v-app>
      <header>
        <Navbar/>
      </header>
      <v-main class="backdrop">
        <v-container fluid class="pa-0">
        <div>
          <slot/>
        </div>
        </v-container>
      </v-main>
      <footer>
        <Footerbar/>
      </footer>
    </v-app>
  </template>
  
  <script lang="ts" setup>
import Navbar from '~/components/navbar.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
onMounted(async () => {
  await authStore.fetchUser();
});
  
  
  </script>
  
  <style>

  .backdrop{
    background-color: rgb(32, 32, 32);
    background-image: url("assets/backdrop11.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

  }



  </style>
  