import type { Metadata } from "next";
import "./globals.css";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata: Metadata = {
  title: "TaskMaster Pro - Modern Task Management",
  description: "Secure and efficient task management for developers and teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
