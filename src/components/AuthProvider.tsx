// components/AuthProvider.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Add this import

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading } = useAuth();
  const { setUser, setLoading, setToken } = useAuthStore();
  const { getAccessTokenSilently } = useAuth0(); // Add this hook

  useEffect(() => {
    setLoading(isLoading);

    const getToken = async () => {
      if (user) {
        const roles = user["https://rosehub.com/roles"] || [];
        setUser(user, roles);

        try {
          // Get token directly from Auth0
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
          // Also store in localStorage for easy access
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', accessToken);
          }
        } catch (err) {
          console.error("Failed to get token:", err);
          setToken(null);
        }
      } else if (!isLoading) {
        setUser(null, []);
        setToken(null);
      }
    };

    getToken();
  }, [user, isLoading, setUser, setToken, setLoading, getAccessTokenSilently]);

  if (error) console.error("Auth error:", error);

  return <>{children}</>;
}

// Remove the getTokenFromStorage function as we'll get token directly from Auth0