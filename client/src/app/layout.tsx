import type { Metadata } from "next";
import "./globals.css";
import ThemeContext from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-client";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ERP Baba",
  description: "Fuzenk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body className="bg-background">
        <Toaster richColors position="top-right" />
        <QueryProvider>
          <ThemeContext>{children}</ThemeContext>
        </QueryProvider>
      </body>
    </html>
  );
}
