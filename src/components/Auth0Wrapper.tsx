"use client";

import { ReactNode } from "react";
import { Auth0Provider } from "@auth0/nextjs-auth0";

interface Auth0WrapperProps {
  children: ReactNode;
}

export default function Auth0Wrapper({ children }: Auth0WrapperProps) {
  return (
    <Auth0Provider>
      {children}
    </Auth0Provider>
  );
}
