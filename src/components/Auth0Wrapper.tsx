"use client";

import { Auth0Provider } from "@auth0/auth0-react";

export default function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || process.env.AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID!;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || process.env.AUTH0_AUDIENCE!;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? window.location.origin : process.env.AUTH0_REDIRECT_URI,
        audience: audience,
        scope: "openid profile email offline_access", // needed for refresh token
      }}
      cacheLocation="localstorage" // persist tokens
      useRefreshTokens={true} // enable refresh tokens
    >
      {children}
    </Auth0Provider>
  );
}
