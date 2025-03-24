import { defineStore } from 'pinia';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  user?: User;
  message?: string;
  error?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async fetchUser() {
      try {
        const response: AuthResponse = await $fetch('/api/auth/me');

        if (response?.user) {
          this.user = response.user;
        } else {
          this.user = null;
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.user = null;
      }
    },

    async login(email: string, password: string) {
      try {
        const response: AuthResponse = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        });

        if (response?.user) {
          this.user = response.user;
        } else {
          throw new Error(response?.error || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' });
        this.user = null;
      } catch (error) {
        console.error('Logout error:', error);
      }
    },

    async updateProfile(updatedData: { username?: string; email?: string; password?: string }) {
      try {
        const response: AuthResponse = await $fetch('/api/auth/update', {
          method: 'PUT',
          body: updatedData,
        });

        if (response?.user) {
          this.user = response.user;
        } else {
          throw new Error(response?.error || 'Update failed');
        }
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    },

    async viewProfile(userId: number) {
      try {
        const response: AuthResponse = await $fetch(`/api/profile/${userId}`);

        if (response?.user) {
          return response.user;
        } else {
          throw new Error(response?.error || 'User not found');
        }
      } catch (error) {
        console.error('View profile error:', error);
        throw error;
      }
    },
  },
});
