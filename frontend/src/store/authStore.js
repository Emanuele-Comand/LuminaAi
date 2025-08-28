import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist((set, get) => ({
    // UI state
    authMode: "login",

    setAuthMode: (mode) => {
      set({ authMode: mode, error: null });
    },

    cleanError: () => {
      set({ error: null });
    },

    // User state
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Auth actions
    login: async (email, password) => {
      set({ isLoading: true, error: null });

      // TODO: Implement login logic
    },
  }))
);
