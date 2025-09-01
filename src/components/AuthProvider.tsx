"use client";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading, getAccessTokenSilently } = useAuth();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(isLoading);

    const fetchToken = async () => {
      if (user) {
        try {
          // Get Auth0 access token
          const token = await getAccessTokenSilently();
          const roles = user["https://rosehub.com/roles"] || [];
          // Store user + access token
          setUser({ ...user, accessToken: token }, roles);
        } catch (err) {
          console.error("Failed to fetch token:", err);
          setUser(null, []);
        }
      } else if (!isLoading) {
        setUser(null, []);
      }
    };

    fetchToken();
  }, [user, isLoading, getAccessTokenSilently, setUser, setLoading]);

  if (error) console.error("Auth error:", error);

  return <>{children}</>;
}
