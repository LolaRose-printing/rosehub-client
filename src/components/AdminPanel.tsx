"use client";

import { useEffect, useState } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthContext } from "@/contexts/AuthContext";

// Extend the User type to include custom properties
interface ExtendedUser {
  email?: string;
  name?: string;
  roles?: string[];
  ['https://rosehub.com/roles']?: string[];
  [key: string]: any;
}

interface AuthProviderProps {
  children: React.ReactNode;
  domain: string;
  clientId: string;
  audience?: string;
  redirectUri?: string;
}

function Auth0ProviderWithConfig({ children, ...props }: AuthProviderProps) {
  return (
    <Auth0Provider
      domain={props.domain}
      clientId={props.clientId}
      authorizationParams={{
        redirect_uri: props.redirectUri,
        audience: props.audience,
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}

function AuthHandler({ children }: { children: React.ReactNode }) {
  const { user, isLoading, getAccessTokenSilently } = useAuth0();
  const [authUser, setAuthUser] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);

  const setUser = (user: any, userRoles: string[]) => {
    setAuthUser(user);
    setRoles(userRoles);
  };

  useEffect(() => {
    if (user) {
      // Type assertion to handle the custom property
      const extendedUser = user as ExtendedUser;
      const userRoles = extendedUser["https://rosehub.com/roles"] || [];
      setUser(user, userRoles);
    } else if (!isLoading) {
      setUser(null, []);
    }
  }, [user, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user: authUser,
        roles,
        isLoading,
        getAccessToken: getAccessTokenSilently,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function AuthProvider({ children, ...props }: AuthProviderProps) {
  return (
    <Auth0ProviderWithConfig {...props}>
      <AuthHandler>{children}</AuthHandler>
    </Auth0ProviderWithConfig>
  );
}
