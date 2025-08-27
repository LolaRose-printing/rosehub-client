//"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "./AuthProvider"; 
//import { Auth0Provider } from "@auth0/auth0-react";
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

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = "https://server.lolaprint.us/api";

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{ redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined, audience }}
        >
          {modal}
          <div id="modal-root" />
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
