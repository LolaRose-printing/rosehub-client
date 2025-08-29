"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";

// Extend the User type to include custom properties
interface ExtendedUser {
  email?: string;
  name?: string;
  roles?: string[];
  ['https://rosehub.com/roles']?: string[];
  [key: string]: any;
}

function SyncAuthState({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading } = useAuth();
  const { setUser, setLoading } = useAuthStore();

  // Sync auth state with Zustand store
  useEffect(() => {
    setLoading(isLoading);

    if (user) {
      // Type assertion to handle the custom property
      const extendedUser = user as ExtendedUser;
      const roles = extendedUser["https://rosehub.com/roles"] || [];
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
