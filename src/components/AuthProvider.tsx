"use client";

import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, error } = useAuth0();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(isLoading);

    if (user) {
      const roles = user["https://rosehub.com/roles"] || [];
      setUser(user, roles);
    } else if (!isLoading) {
      setUser(null, []);
    }

    if (error) console.error("Auth error:", error);
  }, [user, isLoading, error, setUser, setLoading]);

  return <>{children}</>;
}
