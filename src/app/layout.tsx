import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";

import { QueryProvider, ThemeProvider, Toaster } from "@/components";

import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: {
    default: "Slack Emo",
    template: "%s | Slack Emo",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Slack Emo",
    type: "website",
    locale: "ko_KR",
    siteName: "Slack Emo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slack Emo",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Slack Emo",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
            <Analytics />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
