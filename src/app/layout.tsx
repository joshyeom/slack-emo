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
    default: "Slack Emo - Slack 커스텀 이모지 공유 플랫폼",
    template: "%s | Slack Emo",
  },
  description:
    "Slack 워크스페이스를 위한 커스텀 이모지를 찾고, 다운로드하고, 공유하세요. 다양한 카테고리의 이모지를 128x128 Slack 규격에 맞춰 바로 사용할 수 있습니다.",
  keywords: [
    "Slack",
    "이모지",
    "이모티콘",
    "커스텀 이모지",
    "Slack emoji",
    "슬랙 이모지",
    "슬랙 이모티콘",
  ],
  metadataBase: new URL("https://slack-emo.vercel.app"),
  manifest: "/manifest.json",
  openGraph: {
    title: "Slack Emo - Slack 커스텀 이모지 공유 플랫폼",
    description: "Slack 워크스페이스를 위한 커스텀 이모지를 찾고, 다운로드하고, 공유하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "Slack Emo",
    url: "https://slack-emo.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slack Emo - Slack 커스텀 이모지 공유 플랫폼",
    description: "Slack 워크스페이스를 위한 커스텀 이모지를 찾고, 다운로드하고, 공유하세요.",
  },
  verification: {
    google: "jf7pPSbqLjloi6FUTeRrXCGEpiXAB5wninqUIGCNmkk",
  },
  alternates: {
    canonical: "https://slack-emo.vercel.app",
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
