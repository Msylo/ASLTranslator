<template>
  <v-container class="py-6">
    <h1 class="text-2xl font-bold my-10 text-white">Community Categories</h1>

    <div class="pa-3 community-panel rounded-lg">
      <v-row class="mt-4">
        <v-col cols="12" v-for="category in postStore.categories" :key="category.id">
          <v-card
            outlined
            @click="navigateTo(`/community/category/${category.id}`)"
            class="pa-4 cursor-pointer hover:bg-gray-100 transition"
          >
            <v-card-title class="text-2xl font-bold">
              <v-icon :icon="getIconForCategory(category.name)" class="mr-4" color="grey"></v-icon>
              {{ category.name }}
            </v-card-title>
            <v-card-subtitle>{{ category.description || 'No description available.' }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { usePostStore } from '@/stores/post-reply';

const postStore = usePostStore();

onMounted(() => {
  postStore.fetchCategories();
});

const iconMap: Record<string, string> = {
  'Announcements & News': 'mdi-newspaper', // Category 1
  'General Discussion': 'mdi-chat', // Category 2
  'Bugs and Issues': 'mdi-bug', // Category 3
  'Off-Topic': 'mdi-forum', // Category 4
  'Feedback': 'mdi-comment-check', // Category 5
};

// Function to get the icon for a category name, with a fallback icon
const getIconForCategory = (categoryName: string): string => {
  return iconMap[categoryName] || 'mdi-folder-outline';
};


</script>

<style scoped>
.text-2xl {
  font-size: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.community-panel {
  background-image: linear-gradient(
    90deg,
    rgba(0, 65, 98, 0.6) 0%,
    rgba(55, 48, 36, 0.6) 50%,
    rgba(0, 64, 96, 0.6) 100%
  );
}
</style>
