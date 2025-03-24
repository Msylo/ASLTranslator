<template>
  <v-card outlined class="mb-4">
    <v-row>
      <v-col cols="2">
        <div class="text-center p-4">
          <v-avatar size="50" class="mb-2">
            <img src="/assets/owl.jpg" alt="User Avatar" />
          </v-avatar>
          <div>
            <NuxtLink :to="`/profile/${reply.author?.id}`" class="cursor-pointer hover:underline">{{ reply.author?.username }}</NuxtLink>
          <p class="text-sm">Joined {{ formatDate(reply.author?.createdAt) }}</p>
          </div>
          
        </div>
      </v-col>
      <v-col cols="10">
        <small class="text-gray-600 mb-4">Posted {{ formatRelativeTime(reply?.createdAt) }}</small>

        <!-- Editing Reply -->
        <div v-if="editingReply">
          <v-textarea v-model="editedReply" outlined rows="2" auto-grow></v-textarea>
          <v-row justify="end" class="mt-2">
            <v-btn size="small" color="black" class="mr-2" @click="updateReply">Save</v-btn>
            <v-btn size="small" outlined @click="cancelEditReply">Cancel</v-btn>
          </v-row>
        </div>

        <!-- Normal Reply View -->
        <p v-else class="mb-4">{{ reply.content }}</p>

        <v-row justify="end">
          <div v-if="reply.author?.id === authStore.user?.id" class="m-4">
            <v-btn prepend-icon="mdi-square-edit-outline" variant="text" color="black" size="small" @click="openEditReply">Edit</v-btn>
            <v-btn prepend-icon="mdi-delete" variant="text" size="small" @click="deleteReply">Delete</v-btn>
          </div>
          <div v-else class="m-4">
            <v-btn prepend-icon="mdi-comment" variant="text" size="small" color="black" @click="replyToReply">Reply</v-btn>
            <v-btn prepend-icon="mdi-flag" variant="text" size="small">Report</v-btn>
          </div>
        </v-row>

        <!-- Reply Input Field -->
        <v-card v-if="replyingToReply" outlined class="mt-2">
          <v-card-text>
            <v-textarea v-model="replyContent" label="Reply..." outlined rows="2" auto-grow></v-textarea>
            <v-row justify="end" class="mt-2">
              <v-btn size="small" color="black" class="mr-2" @click="submitNestedReply">Save</v-btn>
              <v-btn size="small" outlined @click="cancelReplyToReply">Cancel</v-btn>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Render Child Replies -->
        <div v-if="reply.childReplies?.length">
          <ReplyComponent
            v-for="child in reply.childReplies"
            :key="child.id"
            :reply="child"
            :post-id="postId"
          />
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { usePostStore } from '@/stores/post-reply';
import { useAuthStore } from '@/stores/auth';
import ReplyComponent from './ReplyComponent.vue';

const props = defineProps({
  reply: Object,
  postId: Number,
});

const postStore = usePostStore();
const authStore = useAuthStore();

const editingReply = ref(false);
const editedReply = ref('');
const replyingToReply = ref(false);
const replyContent = ref('');

const openEditReply = () => {
  editingReply.value = true;
  editedReply.value = props.reply.content;
};

const cancelEditReply = () => {
  editingReply.value = false;
  editedReply.value = '';
};

const updateReply = () => {
  if (editedReply.value.trim()) {
    postStore.updateReply(props.reply.id, props.postId, editedReply.value);
    cancelEditReply();
  }
};

const deleteReply = () => {
  postStore.deleteReply(props.reply.id, props.postId);
};

const replyToReply = () => {
  replyingToReply.value = true;
  replyContent.value = '';
};

const cancelReplyToReply = () => {
  replyingToReply.value = false;
  replyContent.value = '';
};

const submitNestedReply = () => {
  if (replyContent.value.trim()) {
    postStore.createReply(props.postId, props.reply.id, replyContent.value);

    postStore.fetchPostById(props.postId);

    cancelReplyToReply();
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
</script>
