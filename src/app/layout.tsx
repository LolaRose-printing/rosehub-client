"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoseHub",
  description: "RoseHub app",
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal?: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  // Pass env variables to your AuthProvider
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || "https://server.lolaprint.us/api";

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider
          domain={domain}
          clientId={clientId}
          audience={audience}
          redirectUri={typeof window !== "undefined" ? window.location.origin : undefined}
        >
          {modal}
          <div id="modal-root" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
