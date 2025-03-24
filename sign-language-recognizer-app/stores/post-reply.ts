import { defineStore } from 'pinia';
import { useFetch } from '#app';

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
  author: Author;
  parentId: number | null;
  status: Status;
  childReplies?: Reply[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  replies: Reply[];
  status: Status;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export const usePostStore = defineStore('postStore', {
  state: () => ({
    posts: [] as Post[],
    currentPost: null as Post | null,
    categories: [] as Category[],
    selectedCategory: null as Category | null,
  }),

  actions: {
    async fetchCategories() {
      try {
        const response = await useFetch<{ categories: Category[] }>('/api/category/list');
        if (response.data.value?.categories) {
          this.categories = response.data.value.categories;
        }
      } catch (error) {
        console.error('Failed to fetch categories:', (error as Error).message);
      }
    },

    async fetchPosts() {
      try {
        const response = await useFetch<{ posts: Post[] }>('/api/posts/list');
        if (response.data.value?.posts) {
          this.posts = response.data.value.posts.filter((post) => post.status !== 'DELETED');
        }
      } catch (error) {
        console.error('Failed to fetch posts:', (error as Error).message);
      }
    },


    async fetchPostsByCategory(categoryId: number) {
      try {
        const response = await useFetch(`/api/category/${categoryId}`);
        console.log('API Response:', response.data.value); // Debugging
    
        if (response.data.value && response.data.value.category) {
          return response.data.value.category;
        } else {
          return { name: 'Unknown Category', posts: [] };
        }
      } catch (error) {
        console.error('Failed to fetch posts by category:', error);
        return { name: 'Error', posts: [] };
      }
    },
    
    

    async fetchPostById(postId: number) {
      try {
        const response = await useFetch<Post>(`/api/posts/${postId}`);
        if (response.data.value) {
          this.currentPost = {
            ...response.data.value,
            replies: response.data.value.replies.filter((reply) => reply.status !== 'DELETED'),
          };
        }
      } catch (error) {
        console.error('Failed to fetch post:', (error as Error).message);
        this.currentPost = null;
      }
    },

    async createPost({ title, content, categoryId }: { title: string; content: string; categoryId: number }) {
      try {
        const response = await useFetch('/api/posts/create', {
          method: 'POST',
          body: { title, content, categoryId },
        });
        
        if (response.data.value) {
          this.posts.unshift(response.data.value.post);
          return response.data.value.post;
        }
    
        return null;
      } catch (error) {
        console.error("Failed to create post:", (error as Error).message);
        return null;
      }
    },
    

    async updatePost(postId: number, title: string, content: string) {
      const post = this.posts.find((p) => p.id === postId);
      if (!post || post.status === 'DELETED' || post.status === 'LOCKED') {
        console.error('Cannot update a deleted or locked post.');
        return;
      }

      try {
        const response = await useFetch<Post>(`/api/posts/${postId}`, {
          method: 'PUT',
          body: { title, content },
        });

        if (response.data.value) {
          await this.fetchPostById(postId);
        }
      } catch (error) {
        console.error('Failed to update post:', (error as Error).message);
      }
    },

    async deletePost(postId: number) {
      try {
        await useFetch(`/api/posts/${postId}`, { method: 'DELETE' });

        this.posts = this.posts.map((post) =>
          post.id === postId ? { ...post, title: '[Deleted]', content: '[Deleted]', status: 'DELETED' } : post
        );

        if (this.currentPost?.id === postId) {
          this.currentPost = { ...this.currentPost, title: '[Deleted]', content: '[Deleted]', status: 'DELETED' };
        }
      } catch (error) {
        console.error('Failed to delete post:', (error as Error).message);
      }
    },

    async createReply(postId: number, parentReplyId: number | null, content: string) {
      try {
        const response = await useFetch<Reply>('/api/reply/create', {
          method: 'POST',
          body: { postId, content, parentReplyId },
        });

        if (response.data.value) {
          await this.fetchPostById(postId);
        }
      } catch (error) {
        console.error('Failed to create reply:', (error as Error).message);
      }
    },

    async updateReply(replyId: number, postId: number, content: string) {
      const reply = this.currentPost?.replies.find((r) => r.id === replyId);
      if (!reply || reply.status === 'DELETED' || reply.status === 'LOCKED') {
        console.error('Cannot update a deleted or locked reply.');
        return;
      }

      try {
        const response = await useFetch<Reply>(`/api/reply/${replyId}`, {
          method: 'PUT',
          body: { content },
        });

        if (response.data.value) {
          await this.fetchPostById(postId);
        }
      } catch (error) {
        console.error('Failed to update reply:', (error as Error).message);
      }
    },

    async deleteReply(replyId: number, postId: number) {
      try {
        await useFetch(`/api/reply/${replyId}`, { method: 'DELETE' });

        if (this.currentPost?.id === postId) {
          const markReplyDeleted = (replies: Reply[]): Reply[] =>
            replies.map((reply) =>
              reply.id === replyId
                ? { ...reply, content: '[Deleted]', status: 'DELETED', childReplies: markReplyDeleted(reply.childReplies || []) }
                : { ...reply, childReplies: reply.childReplies ? markReplyDeleted(reply.childReplies) : [] }
            );

          this.currentPost.replies = markReplyDeleted(this.currentPost.replies);
        }
      } catch (error) {
        console.error('Failed to delete reply:', (error as Error).message);
      }
    },
  },
});
