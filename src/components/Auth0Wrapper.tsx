"use client";
import { Auth0Provider } from "@auth0/auth0-react";

export default function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!; // 👈 Add this to your .env

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience,
        scope: "openid profile email",
        redirect_uri: `${baseUrl}/api/auth/callback`, // 👈 fix here
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  );
}
