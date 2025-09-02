"use client";
import { Auth0Provider } from "@auth0/auth0-react";

export default function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!; // Changed to NEXT_PUBLIC_
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!; // Use environment variable

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
        audience,
        scope: "openid profile email", // Added scope
      }}
      cacheLocation="localstorage" // Added for better token management
      useRefreshTokens={true} // Enable refresh tokens
    >
      {children}
    </Auth0Provider>
  );
}