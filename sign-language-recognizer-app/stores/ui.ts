import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    loginDialog: false,
  }),
  actions: {
    showLoginDialog() {
      this.loginDialog = true;
    },
    hideLoginDialog() {
      this.loginDialog = false;
    },
  },
});
