<template>
  <v-container class="py-12">
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="6" class="text-center">
        <v-avatar size="150" class="mb-4 bg-white">
          <img src="/assets/default-avatar.png" alt="Profile Picture" />
        </v-avatar>
        <h1 class="text-3xl font-bold mb-2 text-white">{{ user?.username }}</h1>
      </v-col>
    </v-row>

    <!-- Profile Details Section -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-text>
            <table class="w-full text-left">
              <tr><td class="font-bold py-2">Username:</td><td>{{ user?.username }}</td></tr>
              <tr><td class="font-bold py-2">Email:</td><td>{{ user?.email }}</td></tr>
              <tr><td class="font-bold py-2">Posts:</td><td>{{ user?.posts?.length }}</td></tr>
              <tr><td class="font-bold py-2">Replies:</td><td>{{ user?.replies?.length }}</td></tr>
            </table>
          </v-card-text>
          
          <v-card-actions v-if="isOwnProfile">
            <v-btn color="primary" @click="openEditProfile">Edit Profile</v-btn>
            <v-btn color="primary" @click="openChangePassword">Change Password</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabs Section -->
    <v-tabs v-model="currentTab">
      <v-tab value="posts" class="text-white">Posts</v-tab>
      <v-tab value="replies" class="text-white">Replies</v-tab>
    </v-tabs>

    <v-window v-model="currentTab">
      <!-- Posts Tab -->
      <v-window-item value="posts">
        <v-row>
          <v-col cols="12" md="8">
            <div v-if="user?.posts?.length">
              <v-card v-for="post in user.posts" :key="post.id" v-show="!post.isDeleted" class="mb-4" @click="navigateTo(`/community/post/${post.id}`)">
                <v-card-text>{{ formatRelativeTime(post.createdAt) }}</v-card-text>
                <v-card-title>{{ post.title }}</v-card-title>
                <v-card-text>{{ post.content }}</v-card-text>
              </v-card>
            </div>
            <p v-else class="text-center text-white">No posts available</p>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Replies Tab -->
      <v-window-item value="replies">
        <v-row>
          <v-col cols="12" md="8">
            <div v-if="user?.replies?.length">
              <v-card v-for="reply in user.replies" :key="reply.id" v-show="!reply.isDeleted" class="mb-4" @click="navigateTo(`/community/post/${reply.post.id}`)">
                <v-card-text>{{ formatRelativeTime(reply.createdAt) }}</v-card-text>
                <v-card-subtitle>Replied to: {{ reply.post.title }}</v-card-subtitle>
                <v-card-text>{{ reply.content }}</v-card-text>
              </v-card>
            </div>
            <p v-else class="text-center text-white">No replies available</p>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <!-- Edit Profile Dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Edit Profile</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="editUsername" label="Username" outlined />
            <v-text-field v-model="editEmail" label="Email" outlined type="email" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveProfile">Save</v-btn>
          <v-btn color="secondary" @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Change Password Dialog -->
    <v-dialog v-model="passwordDialog" max-width="500">
      <v-card>
        <v-card-title>Change Password</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="currentPassword" label="Current Password" outlined type="password" />
            <v-text-field v-model="newPassword" label="New Password" outlined type="password" />
            <v-text-field v-model="confirmPassword" label="Confirm Password" outlined type="password" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="changePassword">Change</v-btn>
          <v-btn color="secondary" @click="passwordDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';

const profileStore = useProfileStore();
const authStore = useAuthStore();
const route = useRoute();
const userId = Number(route.params.profile_id);

onMounted(() => {
  profileStore.fetchProfile(userId);
});

const user = computed(() => profileStore.user);
const isOwnProfile = computed(() => authStore.user?.id === userId);

const editDialog = ref(false);
const passwordDialog = ref(false);
const currentTab = ref(0);
const editUsername = ref("");
const editEmail = ref("");

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// Open dialogs
const openEditProfile = () => {
  editUsername.value = user.value?.username || "";
  editEmail.value = user.value?.email || "";
  editDialog.value = true;
};

const openChangePassword = () => {
  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  passwordDialog.value = true;
};

// Save profile changes
const saveProfile = async () => {
  try {
    await authStore.updateProfile({ username: editUsername.value, email: editEmail.value });
    editDialog.value = false;
    profileStore.fetchProfile(userId);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

// Change password
const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  try {
    await authStore.updateProfile({ password: newPassword.value });
    passwordDialog.value = false;
    profileStore.fetchProfile(userId);

  } catch (error) {
    console.error("Error changing password:", error);
  }
};

// Format time
const formatRelativeTime = (dateString: string | number | Date) => {
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
</script>

<style>

</style>
