const sessionStore = new Map<string, number>();

export function useSessionStore() {
  return {
    createSession(userId: number) {
      const sessionId = crypto.randomUUID();
      sessionStore.set(sessionId, userId);
      return sessionId;
    },
    getUserId(sessionId: string) {
      return sessionStore.get(sessionId);
    },
    destroySession(sessionId: string) {
      sessionStore.delete(sessionId);
    },
  };
}
