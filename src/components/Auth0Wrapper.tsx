// components/Auth0Wrapper.tsx
"use client";
import { Auth0Provider } from "@auth0/auth0-react";

export default function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!;

  // Use the production URL always
  const redirectUri = "https://client.lolaprint.us/api/auth/callback";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  );
}