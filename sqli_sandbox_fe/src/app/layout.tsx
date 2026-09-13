import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PwnAcademy - SQLi Sandbox",
  description: "Computer Science presentation sandbox",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-zinc-50`}>
        {/* Everything inside the body MUST be inside the AuthProvider */}
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <footer className="p-6 bg-zinc-900 text-zinc-400 text-center mt-auto">
            <p>© 2026 PwnAcademy. For educational CS presentation purposes only.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
