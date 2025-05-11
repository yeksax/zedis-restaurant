import { server_getAdmin } from "@/actions/admin-management-actions";
import { AdminProvider } from "@/providers/admin-provider";
import { PostHogProvider } from "@/providers/posthog-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const apparel = localFont({
  src: "./apparel.otf",
  variable: "--font-apparel",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zedis Restaurante",
  description: "Experiência Gastronômica Premium — Demo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminPermission = await server_getAdmin();

  return (
    <ClerkProvider>
      <html lang="pt-br">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${apparel.variable} antialiased grid grid-rows-[1fr_auto] min-h-screen font-sans`}
        >
          <PostHogProvider>
            <AdminProvider adminPermission={adminPermission}>
              <QueryProvider>{children}</QueryProvider>
              <div className="fixed">
                <Toaster />
              </div>
            </AdminProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
