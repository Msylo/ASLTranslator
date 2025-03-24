<template>
  <v-container class="py-12">
    <!-- Title Section -->
    <v-row justify="center" class="asl-hero-bg shadow-lg">
      <v-col cols="12" class="text-center content-center">
        <v-avatar image="assets\logo-white.png" size="150"></v-avatar>
        <h1 class="text-6xl font-bold mb-6">
          American Sign-Language Translator</h1>
        <v-btn class="ml-4" elevation="10" color="blue-darken-4" @click="navigateTo('/register')">Register</v-btn>
      </v-col>
    </v-row>

    <v-row justify="center" class="my-8">
      <v-col cols="12" md="8" class="text-center">
        <div class="chip-card pa-8 rounded-lg">
          <v-sheet height="300" class="chip-sheet">
            <v-icon size="100" color="white" class="border-4 rounded-3xl border-white ma-4">mdi-chip</v-icon>
            <h3 class="text-3xl font-bold mb-4 text-white">Powered By AI</h3>
            <p class="text-white">Our detection is powered by Ultralytic's YOLO objection detecttion, custom trained on data garnered from the sign-language community.</p>
          </v-sheet>
        </div>
      </v-col>
    </v-row>

    <!-- Join Our Community Section -->
    <v-row class="text-center com-panel">
      <v-col cols="12">
        <h2 class="text-3xl font-bold mb-4">Join Our Community</h2>
      </v-col>
      
      <v-col cols="12" md="4">
        <!---Card 1--->
        <v-card outlined>
          <v-card-text>
            <h3 class="text-xl font-semibold mb-2">Translate</h3>
            <p class="text-gray-500">
              Utilize our growing Artificial Intelligence model to bridge the gap in communication with the deaf and hard of hearing community.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <!--Card 2-->
        <v-card outlined>
          <v-card-text>
            <h3 class="text-xl font-semibold mb-2">Interact</h3>
            <p class="text-gray-500">
              Have a question? Have something to discuss? Post and respond in our Community Board. Become an active part of our community. 
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <!--Card 3-->
        <v-card outlined>
          <v-card-text>
            <h3 class="text-xl font-semibold mb-2">Contribute</h3>
            <p class="text-gray-500">
              Want to becomme part of the team or contribute to the project's success?  Head over to our contact page and get in touch with us!
            </p>
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

.asl-hero-bg{
  height: 30rem;
  border-radius: 0.5rem;
  color: aliceblue;
  background-image: linear-gradient(180deg,
      rgba(0, 65, 98, 0.6) 0%,
      rgba(55, 48, 36, 0.6) 100%),
      url("assets/hero-bg.png");
  background-position: center;
  background-size: auto;
  background-repeat: no-repeat;
  
}

.com-panel{
  color: white;
  border-radius: 10px;
  background-image: linear-gradient(90deg,
      rgba(0, 65, 98, 0.6) 0%,
      rgba(55, 48, 36, 0.6) 50%,
      rgba(0, 64, 96, 0.6) 100%
  );
}

.chip-card{
  border-radius: 10px;
  background-image: linear-gradient(90deg,
      rgba(0, 65, 98, 0.6) 0%,
      rgba(55, 48, 36, 0.6) 50%,
      rgba(0, 64, 96, 0.6) 100%
  );

}

.chip-sheet{
  border-radius: 2rem;
  background-image: linear-gradient(180deg,
      rgba(0, 65, 98, 0.6) 0%,
      rgba(55, 48, 36, 0.6) 100%),
      url("assets/index-gif.gif");
}

</style>

