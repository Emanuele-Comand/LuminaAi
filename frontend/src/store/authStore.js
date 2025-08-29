import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // UI state
      authMode: "login",

      setAuthMode: (mode) => {
        console.log("setAuthMode called with:", mode);
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

        try {
          const response = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          // Salva il token nel localStorage
          localStorage.setItem("token", data.token);

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          console.error("Login error:", error);
          set({
            isLoading: false,
            error: error.message || "Login failed",
          });
          return { success: false, error: error.message };
        }
      },

      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(
            "http://localhost:4000/api/auth/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password, name }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Signup failed");
          }

          // Salva il token nel localStorage
          localStorage.setItem("token", data.token);

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          console.error("Signup error:", error);
          set({
            isLoading: false,
            error: error.message || "Signup failed",
          });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        // Rimuovi il token dal localStorage
        localStorage.removeItem("token");

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
          });
          return false;
        }

        try {
          const response = await fetch("http://localhost:4000/api/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Token invalid");
          }

          const data = await response.json();

          set({
            user: data.user,
            isAuthenticated: true,
          });

          return true;
        } catch (error) {
          console.error("Auth check error:", error);
          // Rimuovi il token invalido
          localStorage.removeItem("token");
          set({
            user: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        authMode: state.authMode,
      }),
    }
  )
);
