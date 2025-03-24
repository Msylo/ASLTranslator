<template>
    <v-container class="py-12">
      <!-- Title -->
      <v-row>
        <v-col cols="12">
          <h1 class="text-3xl font-bold mb-6 text-white">Resources</h1>
        </v-col>
      </v-row>
  
      <!-- Learning Section -->
      <v-row class="mb-12">
        <v-col cols="12">
          <h2 class="text-2xl font-semibold mb-4 text-white">Learning</h2>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card outlined class="pa-4" @click="navigateTo('http://handspeak.com', {open: {
            target:'_blank'
          }})">
            <v-img src="assets/handspeak-logo.jpg" height="120"></v-img>
            <v-card-title>Handspeak</v-card-title>
            <v-card-text>
              Dictionary for American sign-language, with video for replication.
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card outlined class="pa-4" @click="navigateTo('http://aslized.org', {open: {
            target:'_blank'
          }})">
            <v-img src="assets/aslized-logo.jpg" height="120"></v-img>
            <v-card-title>ASLized</v-card-title>
            <v-card-text>
              Videos, literature and instructional material for the learning of sign language.
            </v-card-text>
          </v-card>
        </v-col>
        
      </v-row>
  
      <!-- Relevant Links Section -->
      <v-row class="mb-12">
        <v-col cols="12">
          <h2 class="text-2xl font-semibold mb-4  text-white">Relevant Links</h2>
        </v-col>
        <v-col cols="12">
          <v-card outlined class="pa-4 mb-4">
            <v-img src="/assets/SchoolofDeaf_logo.jpg" height="200"></v-img>
            <v-card-title>School For the Deaf (Grenada)</v-card-title>
            <v-card-text>
              Perdmontemps, Saint David, Grenada
            </v-card-text>
          </v-card>
          <v-card outlined class="pa-4">
            <v-img src="assets/deafvoices-logo.png" height="200"></v-img>
            <v-card-title>Deaf Voices Grenada</v-card-title>
            <v-card-text>
              A non-profit organization with its sole purpose to improve the living standards of our deaf population in Grenada.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Recent News Section -->
      <v-row>
        <v-col cols="12">
          <h2 class="text-2xl font-semibold mb-4 text-white">Recent News</h2>
        </v-col>
        <v-col cols="12" md="6" lg="3" v-for="i in 4" :key="i">
          <v-card outlined class="pa-4">
            <v-img src="assets/missing-document.png" height="120"></v-img>
            <v-card-title>Title</v-card-title>
            <v-card-text>
              No Articles to show at this moment.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  </script>
  
  <style scoped>
  .text-gray-500 {
    color: #6b7280;
  }
  </style>
  