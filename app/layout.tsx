import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppFooter } from "@/components/layout/app-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { auth0 } from "@/lib/auth0";
import { AppProviders } from "@/providers";
import { Auth0AppProvider } from "@/providers/auth0-app-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PetMind AI",
    template: "%s · PetMind AI",
  },
  description:
    "Asistente de cuidado de mascotas potenciado por IA. Respuestas con fuentes y avisos veterinarios.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Auth0AppProvider user={session?.user}>
          <AppProviders>
            <SiteHeader session={session} />
            {children}
            <AppFooter />
          </AppProviders>
        </Auth0AppProvider>
      </body>
    </html>
  );
}
