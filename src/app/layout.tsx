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
    default: "Slack Emo - 슬랙 커스텀 이모지 무료 다운로드 & 공유",
    template: "%s | Slack Emo",
  },
  description:
    "슬랙 워크스페이스를 위한 커스텀 이모지를 무료로 다운로드하세요. 귀여운, 웃긴, 업무용 이모티콘 모음을 128x128 Slack 규격에 맞춰 바로 사용할 수 있습니다. 슬랙 이모지 팩, 움짤 GIF 이모티콘까지 한곳에서.",
  keywords: [
    "슬랙 이모지",
    "슬랙 이모티콘",
    "슬랙 커스텀 이모지",
    "슬랙 이모지 다운로드",
    "슬랙 이모지 무료",
    "슬랙 이모지 모음",
    "슬랙 이모지 팩",
    "슬랙 이모지 만들기",
    "슬랙 이모지 추가",
    "슬랙 움짤 이모지",
    "슬랙 GIF 이모지",
    "슬랙 리액션 이모지",
    "업무용 이모티콘",
    "회사 슬랙 이모지",
    "Slack emoji",
    "Slack custom emoji",
    "Slack 이모지",
  ],
  metadataBase: new URL("https://slack-emo.vercel.app"),
  manifest: "/manifest.json",
  openGraph: {
    title: "Slack Emo - 슬랙 커스텀 이모지 무료 다운로드",
    description:
      "슬랙 이모지 & 이모티콘을 무료로 다운로드하세요. 귀여운, 웃긴, 업무용 이모지 모음.",
    type: "website",
    locale: "ko_KR",
    siteName: "Slack Emo",
    url: "https://slack-emo.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slack Emo - 슬랙 커스텀 이모지 무료 다운로드",
    description:
      "슬랙 이모지 & 이모티콘을 무료로 다운로드하세요. 귀여운, 웃긴, 업무용 이모지 모음.",
  },
  verification: {
    google: "jf7pPSbqLjloi6FUTeRrXCGEpiXAB5wninqUIGCNmkk",
    other: {
      "naver-site-verification": "5d7f23e5156ef197de37534168c6955b610b2bef",
    },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Slack Emo",
  url: "https://slack-emo.vercel.app",
  description: "슬랙 워크스페이스를 위한 커스텀 이모지를 무료로 다운로드하고 공유하는 플랫폼",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  inLanguage: "ko",
  author: {
    "@type": "Organization",
    name: "Slack Emo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
