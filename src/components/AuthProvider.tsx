// components/AuthProvider.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading } = useAuth();
  const { setUser, setLoading, setToken } = useAuthStore();

  useEffect(() => {
    setLoading(isLoading);

    if (user) {
      const roles = user["https://rosehub.com/roles"] || [];
      setUser(user, roles);

      // Extract token from user or fetch it
      const accessToken = user.accessToken || getTokenFromStorage();
      setToken(accessToken);
    } else if (!isLoading) {
      setUser(null, []);
      setToken(null);
    }
  }, [user, isLoading, setUser, setToken, setLoading]);

  if (error) console.error("Auth error:", error);

  return <>{children}</>;
}

// Helper function to get token from storage
function getTokenFromStorage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || null;
  }
  return null;
}