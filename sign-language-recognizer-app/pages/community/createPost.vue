<template>
  <v-container class="py-12">
    <!-- Header Section -->
    <v-row class="mb-8">
      <h1 class="text-2xl font-bold text-white">Community Board</h1>
    </v-row>
    <v-row class="mb-8">
      <h2 class="text-xl font-medium text-white">Create Post</h2>
    </v-row>

    <div class="create-post-panel pa-4 rounded-lg">
      <v-row>
        <v-col cols="12">
          <v-form ref="form">
            <v-text-field
              label="Title"
              v-model="title"
              bg-color="white"
              outlined
              required
              class="mb-6"
            ></v-text-field>

            <!-- Category Dropdown -->
            <v-select
              v-model="selectedCategory"
              :items="categoryOptions"
              item-title="name"
              item-value="id"
              label="Category"
              bg-color="white"
              outlined
              required
              class="mb-6"
            ></v-select>

            <v-textarea
              label="Body"
              v-model="body"
              bg-color="white"
              outlined
              required
              counter
              no-resize
              rows="10"
              class="mb-6"
            ></v-textarea>

            <v-row justify="space-evenly" align="center">
              <v-col cols="auto">
                <v-btn 
                  color="black"
                  :loading="loading"
                  @click="submitPost"
                >
                  Create
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn 
                  outlined
                  @click="cancel"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/post-reply';

const postStore = usePostStore();

// Form fields
const title = ref('');
const body = ref('');
const selectedCategory = ref(null);
const loading = ref(false);

// Fetch categories on mount
onMounted(() => {
  postStore.fetchCategories();
});

// Computed list of categories for dropdown
const categoryOptions = computed(() => postStore.categories);

//Submit Post

const submitPost = async () => {
  if (!title.value || !body.value || !selectedCategory.value) {
    alert("Please fill in all fields.");
    return;
  }

  loading.value = true;
  try {
    const newPost = await postStore.createPost({
      title: title.value,
      content: body.value,
      categoryId: selectedCategory.value,
    });

    if (newPost && newPost.id) {
      navigateTo(`/community/post/${newPost.id}`);
    } else {
      console.warn("Post ID not found, redirecting to dashboard...");
      navigateTo("/community/dashboard");
    }
  } catch (error) {
    console.error("Failed to create post:", error);
    alert("Failed to create post. Please try again.");
  } finally {
    loading.value = false;
  }
};



// Cancel action
const cancel = () => {
  navigateTo('/community/dashboard');
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.text-2xl {
  font-size: 1.5rem;
}
.text-xl {
  font-size: 1.25rem;
}
.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}

.create-post-panel {
  background-image: linear-gradient(
    90deg,
    rgba(0, 65, 98, 0.4) 0%,
    rgba(55, 48, 36, 0.4) 50%,
    rgba(0, 64, 96, 0.4) 100%
  );
}
</style>
