"use client";

import { ReactNode } from "react";
import { Auth0Provider } from "@auth0/auth0-react";

interface Auth0WrapperProps {
  children: ReactNode;
}

export default function Auth0Wrapper({ children }: Auth0WrapperProps) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!;
  const redirectUri = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    : "https://client.lolaprint.us/api/auth/callback";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
        scope: "openid profile email offline_access",
      }}
      cacheLocation="localstorage" // persist tokens
      useRefreshTokens={true} // enable refresh tokens
    >
      {children}
    </Auth0Provider>
  );
}
