"use client";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading, getAccessTokenSilently } = useAuth();
  const { setUser, setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(isLoading);

    const loadUser = async () => {
      if (user) {
        const roles = user["https://rosehub.com/roles"] || [];
        setUser(user, roles);

        try {
          const token = await getAccessTokenSilently?.();
          const expiration = Date.now() + 60 * 60 * 1000; // example: 1 hour
          setAuth(user.email, token || "", expiration);
        } catch (err) {
          console.error("Failed to get access token:", err);
          setAuth(user.email, "", 0);
        }
      } else if (!isLoading) {
        setUser(null, []);
        setAuth("", "", 0);
      }
    };

    loadUser();
  }, [user, isLoading, setUser, setAuth, getAccessTokenSilently, setLoading]);

  if (error) console.error("Auth error:", error);

  return <>{children}</>;
}
