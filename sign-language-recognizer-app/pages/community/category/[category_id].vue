<template>
  <v-container class="py-6">
    <h1 class="text-2xl font-bold my-10 text-white">{{ categoryName }}</h1>

    <div class="pa-3 community-panel rounded-lg">

      <!-- Category Navigation -->
      <v-row class="category-links mt-4">
        <v-btn
          class="m-2 text-white"
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="navigateTo(`/community/dashboard`)"
        >
        Return to Dashboard
        </v-btn>
      </v-row>

      <!-- Sorting & Search -->
       
      <v-row align="center" class="p-5 space-between justify-end">
        <v-select v-model="sortOption" :items="sortOptions" label="Sort" variant="outlined" class="max-w-32 m-4 text-white" />
        <v-text-field v-model="searchQuery" placeholder="Search" dense variant="solo-inverted" append-icon="mdi-magnify" class="max-w-64 m-4 text-white" />
      </v-row>
      <v-btn color="black" class="text-white" outlined @click="navigateTo('/community/createPost')">
        Create Post
      </v-btn>
      <!-- Post List -->
      <v-col cols="12" v-for="(post, index) in paginatedPosts" :key="index" class="mb-4">
        <v-card outlined @click="navigateTo(`/community/post/${post.id}`)" class="cursor-pointer hover:bg-gray-100 transition">
          <v-card-text>
            <h2 class="text-lg">{{ post.title }}</h2>
            <div class="text-sm text-gray-500 mt-4">Created at: {{ formatDate(post.createdAt) }}</div>
            <div class="text-sm text-gray-500">By: {{ post.author?.username }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Pagination -->
      <v-pagination v-model="currentPage" :length="paginationLength" total-visible="7" class="mt-6 text-white" />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '@/stores/post-reply';

const postStore = usePostStore();
const route = useRoute();
const router = useRouter();
const categoryId = Number(route.params.category_id);
const categoryName = ref('');

// Fetch the category and posts within it on mount
onMounted(async () => {
  try {
    const categoryData = await postStore.fetchPostsByCategory(categoryId);
    categoryName.value = categoryData?.name || 'Unknown Category';
    if (categoryData && categoryData.posts) {
      postStore.posts = categoryData.posts;
    }
  } catch (error) {
    console.error('Failed to fetch category data:', error);
  }
});

// Sorting and Pagination
const sortOptions = ['Newest', 'Oldest'];
const sortOption = ref(sortOptions[0]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

// Computed properties
const filteredPosts = computed(() => {
  let posts = [...postStore.posts];

  // Sort posts
  if (sortOption.value === 'Newest') {
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Filter by search query
  return posts.filter((post) =>
    post?.title && searchQuery.value ? post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) : true
  );
});

const paginationLength = computed(() => Math.ceil(filteredPosts.value.length / itemsPerPage));

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPosts.value.slice(start, end);
});

// Utility functions
const formatDate = (dateString: string) => new Date(dateString).toLocaleString();
const navigateTo = (path: string) => router.push(path);
</script>

<style scoped>
.text-2xl {
  font-size: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-500 {
  color: #6b7280;
}
.cursor-pointer {
  cursor: pointer;
}
.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}
.community-panel {
  background-image: linear-gradient(90deg, rgba(0, 65, 98, 0.6) 0%, rgba(55, 48, 36, 0.6) 50%, rgba(0, 64, 96, 0.6) 100%);
}
</style>
