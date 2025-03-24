<template>
  <v-container class="py-12">
    <!-- Contact Us Section -->
    <v-row class="mb-12">
      <v-col cols="12">
        <h1 class="text-3xl font-bold mb-6 text-white">Contact Us</h1>
      </v-col>
      <v-col cols="12">
        <div class="pa-6 contact-panel rounded-lg">
          <v-row justify="space-around" align="center">
            <!-- Phone -->
            <v-col cols="12" md="3" class="text-center">
              <v-card class="contact-card">
                <v-icon size="40" class="mb-2">mdi-phone</v-icon>
                <p class="text-lg font-semibold">Phone</p>
                <p>440-0000</p>
                <p>449-0000</p>
              </v-card>
            </v-col>
            <!-- Mail -->
            <v-col cols="12" md="3" class="text-center">
              <v-card class="contact-card">
                <v-icon size="40" class="mb-2">mdi-email</v-icon>
                <p class="text-lg font-semibold">Mail</p>
                <p>translate_gsi@mail.com</p>
              </v-card>
            </v-col>
            <!-- Address -->
            <v-col cols="12" md="3" class="text-center">
              <v-card class="contact-card">
                <v-icon size="40" class="mb-2">mdi-map-marker</v-icon>
              <p class="text-lg font-semibold">Address</p>
              <p>Tanteen</p>
              <p>St. George's, Grenada</p>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- Online Inquiry Section -->
  <div class="pa-8 inquiry-card rounded-lg">
    <v-row>

      <v-col cols="12" md="6">
        <v-card class="pa-8">
          <h2 class="text-2xl font-semibold mb-4">Online Inquiry</h2>
          <p class="text-gray-500 mb-4">
            We are here to help! Let us know how best we can serve you. Use the contact form to email us what best fits your needs. It is an honour to support you in your endeavours to find common ground within the deaf community.
          </p>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
      <v-card class="pa-8">
        <v-form>
          <v-text-field label="First Name" outlined class="mb-4"></v-text-field>
          <v-text-field label="Last Name" outlined class="mb-4"></v-text-field>
          <v-text-field label="Email" outlined class="mb-4"></v-text-field>
          <v-textarea label="Message" outlined rows="4" class="mb-4"></v-textarea>
          <v-btn block color="primary" class="text-white">Submit</v-btn>
        </v-form>
      </v-card>
      </v-col>
    </v-row>
  </div>
  </v-container>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f5f5f5;
}
.text-gray-500 {
  color: #000000;
}

.contact-card{
  height: 10rem;
  padding: 1rem;
}

.contact-panel{
  background-image: linear-gradient(90deg,
      rgba(0, 65, 98, 0.4) 0%,
      rgba(55, 48, 36, 0.4) 50%,
      rgba(0, 64, 96, 0.4) 100%
  );
}

.inquiry-card{
  background-image: linear-gradient(90deg,
      rgba(0, 65, 98, 0.4) 0%,
      rgba(55, 48, 36, 0.4) 50%,
      rgba(0, 64, 96, 0.4) 100%
  );

}



</style>

