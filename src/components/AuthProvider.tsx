"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect, ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, error, isLoading } = useAuth();
  const { setUser, setLoading, setToken } = useAuthStore();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // Update loading state
    setLoading(isLoading);

    const initializeAuth = async () => {
      if (user) {
        const roles = user["https://rosehub.com/roles"] || [];
        setUser(user, roles);

        try {
          // Get token directly from Auth0
          const accessToken = await getAccessTokenSilently({
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
            scope: "openid profile email",
          });

          setToken(accessToken);

          if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", accessToken);
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
  }, [user, isLoading, setUser, setToken, setLoading, getAccessTokenSilently]);

  if (error) console.error("[AuthProvider] Auth error:", error);

  return <>{children}</>;
}
