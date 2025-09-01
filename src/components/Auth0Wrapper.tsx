"use client";
import { ReactNode } from "react";

export default function Auth0Wrapper({ children }: { children: ReactNode }) {
  // No Auth0 imports here — all auth handled via API routes or server components
  return <>{children}</>;
}
