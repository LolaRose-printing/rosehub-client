"use client";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading } = useAuth();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(isLoading);
    if (user) {
      const roles = user["https://rosehub.com/roles"] || [];
      setUser(user, roles);
    } else if (!isLoading) {
      setUser(null, []);
    }
  }, [user, isLoading, setUser, setLoading]);

  if (error) console.error("Auth error:", error);

  return <>{children}</>;
}
