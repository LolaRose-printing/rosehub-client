"use client";

import { useEffect } from "react";
import { useUser } from '@auth0/nextjs-auth0/client'; // Changed import
import { useAuthStore } from "@/hooks/useAuthStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, error } = useUser(); // Changed from useAuth0
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(isLoading);

    if (user) {
      // Extract roles from user object - might be in different property
      const roles = user["https://rosehub.com/roles"] || user.roles || [];
      setUser(user, roles);
    } else if (!isLoading) {
      setUser(null, []);
    }

    if (error) console.error("Auth error:", error);
  }, [user, isLoading, error, setUser, setLoading]);

  return <>{children}</>;
}