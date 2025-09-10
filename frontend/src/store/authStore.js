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

      // Token state (in memoria - non persistito)
      accessToken: null,
      tokenExpiresAt: null,
      refreshTimeoutId: null,

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
            credentials: "include", // Include cookies per refresh token
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          // Salva access token IN MEMORIA (non localStorage!)
          const expiresAt = Date.now() + data.expiresIn;

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            accessToken: data.accessToken,
            tokenExpiresAt: expiresAt,
          });

          // Avvia auto-refresh
          get().scheduleTokenRefresh();

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
              credentials: "include", // Include cookies per refresh token
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Signup failed");
          }

          // Salva access token IN MEMORIA (non localStorage!)
          const expiresAt = Date.now() + data.expiresIn;

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            accessToken: data.accessToken,
            tokenExpiresAt: expiresAt,
          });

          // Avvia auto-refresh
          get().scheduleTokenRefresh();

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

      logout: async () => {
        const { refreshTimeoutId } = get();

        // Cancella il timeout del refresh
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }

        try {
          // Chiama logout API per revocare refresh token
          await fetch("http://localhost:4000/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch (error) {
          console.error("Logout API error:", error);
        }

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          accessToken: null,
          tokenExpiresAt: null,
          refreshTimeoutId: null,
        });
      },

      // Auto-refresh del token
      refreshToken: async () => {
        try {
          const response = await fetch(
            "http://localhost:4000/api/auth/refresh",
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Token refresh failed");
          }

          const data = await response.json();
          const expiresAt = Date.now() + data.expiresIn;

          set({
            accessToken: data.accessToken,
            tokenExpiresAt: expiresAt,
            user: data.user,
            isAuthenticated: true,
          });

          get().scheduleTokenRefresh();
          return true;
        } catch (error) {
          console.error("Token refresh failed:", error);
          get().logout();
          return false;
        }
      },

      // Programma il prossimo refresh
      scheduleTokenRefresh: () => {
        const { tokenExpiresAt, refreshTimeoutId } = get();

        // Cancella timeout precedente se esiste
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }

        if (!tokenExpiresAt) return;

        // Refresh 1 minuto prima della scadenza
        const refreshTime = tokenExpiresAt - Date.now() - 60000;

        if (refreshTime > 0) {
          const timeoutId = setTimeout(() => {
            get().refreshToken();
          }, refreshTime);

          set({ refreshTimeoutId: timeoutId });
        }
      },

      checkAuth: async () => {
        const { accessToken } = get();

        // Se abbiamo un token in memoria, verifichiamolo
        if (accessToken) {
          try {
            const response = await fetch("http://localhost:4000/api/auth/me", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const data = await response.json();
              set({
                user: data.user,
                isAuthenticated: true,
              });
              return true;
            }
          } catch (error) {
            console.error("Token validation error:", error);
          }
        }

        // Prova refresh token se access token non valido/assente
        return await get().refreshToken();
      },

      // Utility per ottenere headers autenticati
      getAuthHeaders: () => {
        const { accessToken } = get();
        return accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            }
          : {
              "Content-Type": "application/json",
            };
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
        // NON salvare accessToken, tokenExpiresAt, refreshTimeoutId nel localStorage!
      }),
    }
  )
);
