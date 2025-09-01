"use client";
import { Auth0Provider } from "@auth0/auth0-react";
import { useMemo } from "react";

export default function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = "https://server.lolaprint.us/api";

  const authParams = useMemo(
    () => ({
      redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
      audience,
    }),
    [audience]
  );

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={authParams}
      cacheLocation="localstorage" // optional but helps with silent auth issues
      useRefreshTokens={true}    // strongly recommended to avoid token expiration problems
    >
      {children}
    </Auth0Provider>
  );
}
