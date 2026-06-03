import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/context/auth-context";

import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadFlow AI",
  description:
    "AI-powered CRM platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-full flex flex-col`}
      >
        <AuthProvider>
          {children}

          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}