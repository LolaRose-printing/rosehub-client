import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { deleteCookie, getCookie } from "cookies-next";

type AuthState = {
  email: string;
  expiration: number;
  isAuthenticated: boolean;
  accessToken: string | null;
  user: any | null;
  roles: string[];
  isLoading: boolean;
};

type AuthActions = {
  setEmail: (email: string) => void;
  setAuth: (email: string, accessToken: string, expiration: number) => void;
  setToken: (token: string | null) => void; // <-- added
  setUser: (user: any, roles?: string[]) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  checkAuth: () => boolean;
  initializeAuth: () => void;
};

type AuthStore = AuthState & AuthActions;

const defaultInitState: AuthState = {
  email: "",
  expiration: 0,
  isAuthenticated: false,
  accessToken: null,
  user: null,
  roles: [],
  isLoading: false,
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      ...defaultInitState,
      setEmail: (email: string) => set({ email }),
      setAuth: (email: string, accessToken: string, expiration: number) =>
        set({
          email,
          accessToken,
          expiration,
          isAuthenticated: true,
        }),
      setToken: (token: string | null) => set({ accessToken: token }), // <-- added
      setUser: (user: any, roles: string[] = []) =>
        set({
          user,
          roles,
          email: user?.email || "",
          isAuthenticated: !!user,
        }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      logout: () => {
        deleteCookie("auth");
        deleteCookie("expiration");
        localStorage.removeItem("client_login_status");
        set({
          email: "",
          expiration: 0,
          isAuthenticated: false,
          accessToken: null,
          user: null,
          roles: [],
          isLoading: false,
        });
        window.location.href = "/auth";
      },
      checkAuth: () => {
        const token = getCookie("auth");
        const expiration = getCookie("expiration");
        const now = Date.now();

        if (!token || !expiration || now >= +expiration) {
          set({ isAuthenticated: false, accessToken: null });
          return false;
        }

        set({ isAuthenticated: true, accessToken: token as string });
        return true;
      },
      initializeAuth: () => {
        const token = getCookie("auth");
        const expiration = getCookie("expiration");
        const now = Date.now();

        if (token && expiration && now < +expiration) {
          set({
            isAuthenticated: true,
            accessToken: token as string,
            expiration: +expiration,
          });
        } else {
          set({
            isAuthenticated: false,
            accessToken: null,
            expiration: 0,
          });
        }
      },
    }),
    {
      name: "client_login_status",
      version: 2,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
