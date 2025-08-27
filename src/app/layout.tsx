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
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <AuthProvider>
          {modal}
          <div id="modal-root" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
