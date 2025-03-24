<template>
  <v-container>
    <div class="post-panel pa-4 pa-md-8 rounded-lg">
      <v-card outlined class="mb-4">
        <v-row class="d-flex flex-column flex-md-row">
          <!-- Avatar Section -->
          <v-col cols="12" md="2" class="avatar-section text-center text-md-left pa-5">
            <v-avatar size="80" class="mb-2">
              <img src="/assets/dummy.jpg" alt="Author Avatar" />
            </v-avatar>
            <NuxtLink :to="`/profile/${post?.author.id}`" class="cursor-pointer hover:underline">{{ post?.author.username }}</NuxtLink>
            <p class="text-sm mt-1">Joined {{ formatDate(post?.author.createdAt) }}</p>
          </v-col>

          <!-- Post Content Section -->
          <v-col cols="12" md="10">
            <div class="post-content">
              <h2 class="post-title text-xl font-bold mb-2">{{ post?.title }}</h2>
              <p class="post-text">{{ post?.content }}</p>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- Post Actions (Edit/Delete) -->
      <v-row justify="end" v-if="isPostAuthor">
        <v-btn size="small" color="black" class="mr-2" @click="openEditPostDialog">Edit Post</v-btn>
        <v-btn size="small" outlined class="mr-4" @click="deletePost">Delete</v-btn>
      </v-row>

      <!-- Edit Post Dialog -->
      <v-dialog v-model="isEditingPost" max-width="500px">
        <v-card>
          <v-card-title>Edit Post</v-card-title>
          <v-card-text>
            <v-text-field v-model="editedPostTitle" label="Title" outlined />
            <v-textarea v-model="editedPostContent" label="Content" outlined auto-grow rows="3" />
          </v-card-text>
          <v-card-actions>
            <v-btn color="black" @click="updatePost">Save</v-btn>
            <v-btn outlined @click="cancelEditPost">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Reply Form -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card outlined class="mb-4">
            <v-card-text>
              <v-textarea v-model="newReply" label="Reply..." outlined rows="2" auto-grow></v-textarea>
              <v-row justify="end" class="mt-2">
                <v-btn size="small" color="black" class="mr-2" @click="submitReply">Reply</v-btn>
                <v-btn size="small" outlined @click="newReply = ''">Cancel</v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Replies Section -->
      <v-row>
        <v-col cols="12">
          <ReplyComponent v-for="reply in post?.replies" :key="reply.id" :reply="reply" :post-id="post.id" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePostStore } from '@/stores/post-reply';
import { useRoute } from 'vue-router';


const postStore = usePostStore();
const authStore = useAuthStore();
const route = useRoute();
const newReply = ref('');
const editingReplyId = ref(null);
const editedReply = ref('');
const isEditingPost = ref(false);
const editedPostTitle = ref('');
const editedPostContent = ref('');

const replyingToReplyId = ref(null); 
const replyContent = ref(''); 



// Fetch post data on mount
onMounted(async () => {
  const postId = Number(route.params.post_id);
  await postStore.fetchPostById(postId);
});


const post = computed(() => postStore.currentPost);
const isPostAuthor = computed(() => postStore.currentPost?.author?.id === authStore.user?.id);

// Reply Handling
const submitReply = () => {
  if (newReply.value.trim()) {
    postStore.createReply(post.value.id, null, newReply.value);
    newReply.value = '';
  }
};

const replyToReply = (parentId) => {
  replyingToReplyId.value = parentId;
  replyContent.value = '';
};

const deletePost = () => {
  postStore.deletePost(post.value.id);
};

const deleteReply = (replyId) => {
  postStore.deleteReply(replyId, post.value.id);
};

// Post Editing
const openEditPostDialog = () => {
  isEditingPost.value = true;
  editedPostTitle.value = post.value.title;
  editedPostContent.value = post.value.content;
};

const cancelEditPost = () => {
  isEditingPost.value = false;
  editedPostTitle.value = '';
  editedPostContent.value = '';
};

const updatePost = () => {
  if (editedPostTitle.value.trim() && editedPostContent.value.trim()) {
    postStore.updatePost(post.value.id, editedPostTitle.value, editedPostContent.value);
    cancelEditPost();
  }
};

// Reply Editing
const openEditReplyDialog = (reply) => {
  editingReplyId.value = reply.id;
  editedReply.value = reply.content;
};

const cancelEditReply = () => {
  editingReplyId.value = null;
  editedReply.value = '';
};

const updateReply = (replyId) => {
  if (editedReply.value.trim()) {
    postStore.updateReply(replyId, post.value.id, editedReply.value);
    cancelEditReply();
  }
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const timeIntervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of timeIntervals) {
    const value = Math.floor(diffInSeconds / interval.seconds);
    if (value >= 1) {
      return `${value} ${interval.label}${value > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

const submitNestedReply = (parentReplyId) => {
  if (replyContent.value.trim()) {
    postStore.createReply(post.value.id, parentReplyId, replyContent.value);
    replyingToReplyId.value = null;
    replyContent.value = '';
  }
};
</script>

<style scoped>
.post-panel {
  background-image: linear-gradient(
    90deg,
    rgba(0, 65, 98, 0.6) 0%,
    rgba(55, 48, 36, 0.6) 50%,
    rgba(0, 64, 96, 0.6) 100%
  );
}

.post-content {
  padding: 0 1rem;
}

.post-title {
  margin-bottom: 0.5rem;
}

.post-text {
  font-size: 1rem;
  line-height: 1.6;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
}

@media (max-width: 960px) {
  .post-content {
    padding: 0;
  }

  .avatar-section {
    /* align-items: flex-start; */
    text-align: left;
  }

  .post-panel {
    padding: 1rem;
  }

  .post-title {
    font-size: 1.25rem;
  }

  .post-text {
    font-size: 0.875rem;
  }
}
</style>