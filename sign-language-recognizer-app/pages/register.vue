<template>
  <v-container class="py-12 d-flex flex-column align-center justify-center">
    <!-- Page Title -->
    <h1 class="text-4xl font-bold mb-6 text-white">Register</h1>

    <!-- Registration Form -->
    <v-card class="pa-8" width="400">
      <v-card-text>
        <v-form @submit.prevent="registerUser">
          <!-- Username Input -->
          <v-text-field
            v-model="username"
            label="Username"
            outlined
            class="mb-4"
            required
          ></v-text-field>

          <!-- Email Input -->
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            outlined
            class="mb-4"
            required
          ></v-text-field>

          <!-- Password Input -->
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            outlined
            class="mb-4"
            required
          ></v-text-field>

          <!-- Confirm Password Input -->
          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            outlined
            class="mb-6"
            required
          ></v-text-field>

          <!-- Error Message -->
          <v-alert v-if="errorMessage" type="error" class="mb-4">
            {{ errorMessage }}
          </v-alert>

          <!-- Submit Button -->
          <v-btn color="black" block type="submit" :loading="loading">Register</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const loading = ref(false);

const registerUser = async () => {
  errorMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match!";
    return;
  }

  if(username.value == "" || email.value == "" || password.value == ""){
    errorMessage.value = "All fields must be filled!";
    return;
  }

  loading.value = true;

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (data.error) {
      
      errorMessage.value = data.error;
    } else {
      alert('Registration successful! Redirecting...');
      navigateTo('/'); 
    }
  } catch (error) {
    errorMessage.value = 'Something went wrong!';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-container {
  height: 100vh;
  }

</style>
