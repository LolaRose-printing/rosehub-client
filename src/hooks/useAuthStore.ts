import { create  } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { deleteCookie } from "cookies-next";

type AuthState = {
  email: string;
  expiration: number;
}

type AuthActions = {
  setEmail: (email: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

const defaultInitState: AuthState = {
  email: "",
  expiration: 0,
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      ...defaultInitState,
      setEmail: (email: string) => set({ email }),
      logout: () => {
        deleteCookie("auth");
        deleteCookie("expiration");
        localStorage.removeItem("client_login_status");
      },
    }),
    {
      name: "client_login_status",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
