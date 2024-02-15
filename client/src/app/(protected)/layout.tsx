import type { Metadata } from "next";
import AuthProvider from "@/providers/auth-provider";
import Navbar from "@/components/navbar";
import Navigation from "@/components/navigation";

export const metadata: Metadata = {
  title: "Baba Sistem",
};

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <main className="relative min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col">{children}</div>
        <Navigation />
      </main>
    </AuthProvider>
  );
}
