import { defineStore } from 'pinia';

interface Author {
  id: number;
  username: string;
  createdAt: string;
}

type Status = 'NEW' | 'DELETED' | 'LOCKED';

interface Reply {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
  parentId: number | null;
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
  replies: Reply[];
}

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  posts: Post[];
  replies: Reply[];
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: null as User | null,
  }),

  actions: {
    async fetchProfile(userId: number) {
      try {
        const response = await $fetch<{ user: User }>(`/api/profile/${userId}`);
        if (response.user) {
          this.user = {
            ...response.user,
            posts: response.user.posts.filter((post) => post.status !== 'DELETED'),
            replies: response.user.replies.filter((reply) => reply.status !== 'DELETED'),
          };
        }
      } catch (error) {
        console.error('Failed to fetch profile:', (error as Error).message);
      }
    },
  },
});
