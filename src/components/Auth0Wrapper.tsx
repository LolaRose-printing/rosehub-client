"use client";
import { Auth0Provider } from "@auth0/auth0-react";

export default function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = "https://server.lolaprint.us/api";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
        audience,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
