import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Auth0Wrapper from "@/components/Auth0Wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoseHub",
  description: "RoseHub app",
};

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Auth0Wrapper>
          {modal}
          <div id="modal-root" />
          {children}
        </Auth0Wrapper>
      </body>
    </html>
  );
}
