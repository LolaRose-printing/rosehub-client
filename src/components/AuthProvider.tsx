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

      // Clear token for now; you can later set it if using Auth0 or similar
      setToken(null);
    } else if (!isLoading) {
      setUser(null, []);
      setToken(null);
    }
  }, [user, isLoading, setUser, setToken, setLoading]);

  if (error) console.error("Auth error:", error);

  return <>{children}</>;
}
