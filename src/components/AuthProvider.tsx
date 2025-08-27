"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";

function SyncAuthState({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading } = useAuth();
  const { setUser, setLoading } = useAuthStore();

  // Sync auth state with Zustand store
  useEffect(() => {
    setLoading(isLoading);

    if (user) {
      const roles = user["https://rosehub.com/roles"] || [];
      setUser(user, roles);
    } else if (!isLoading) {
      setUser(null, []);
    }
  }, [user, isLoading, setUser, setLoading]);

  if (error) {
    console.error("Auth error:", error);
  }

  return <>{children}</>;
}

interface AuthProviderProps {
  children: React.ReactNode;
  domain: string;
  clientId: string;
  audience?: string;
  redirectUri?: string;
}

export default function AuthProvider({
  children,
  domain,
  clientId,
  audience,
  redirectUri,
}: AuthProviderProps) {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
      }}
    >
      <SyncAuthState>{children}</SyncAuthState>
    </Auth0Provider>
  );
}
