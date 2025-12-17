// In client/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider"; // <-- Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSync",
  description: "AI-Powered Micro-Mentorship Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <AuthProvider>
          {" "}

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
