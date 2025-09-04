"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect, ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, error, isLoading } = useUser();
  const { setUser, setLoading, setToken } = useAuthStore();

  useEffect(() => {
    setLoading(isLoading);

    const initializeAuth = async () => {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roles = (user as any)?.["https://rosehub.com/roles"] || [];
        setUser(user, roles);

        try {
          // In Next.js, you don't call getAccessTokenSilently on the client.
          // Instead, use your /api/auth route to fetch the access token securely.
          const res = await fetch("/api/auth/token");
          if (res.ok) {
            const { accessToken } = await res.json();
            setToken(accessToken);

            if (typeof window !== "undefined") {
              localStorage.setItem("auth_token", accessToken);
            }
          } else {
            console.error("[AuthProvider] Failed to fetch token");
            setToken(null);
          }
        } catch (err) {
          console.error("[AuthProvider] Failed to get token:", err);
          setToken(null);
        }
      } else if (!isLoading) {
        setUser(null, []);
        setToken(null);
      }
    };

    initializeAuth();
  }, [user, isLoading, setUser, setToken, setLoading]);

  if (error) console.error("[AuthProvider] Auth error:", error);

  return <>{children}</>;
}
