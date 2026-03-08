import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";

import { QueryProvider, ThemeProvider, Toaster } from "@/components";

import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: {
    default: "Slack Emo — 슬랙 커스텀 이모지 디렉토리",
    template: "%s | Slack Emo",
  },
  description:
    "슬랙에서 사용할 수 있는 커스텀 이모지를 검색하고 다운로드하세요. 누구나 이모지를 업로드하고 공유할 수 있습니다.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Slack Emo — 슬랙 커스텀 이모지 디렉토리",
    description: "슬랙에서 사용할 수 있는 커스텀 이모지를 검색하고 다운로드하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "Slack Emo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slack Emo — 슬랙 커스텀 이모지 디렉토리",
    description: "슬랙에서 사용할 수 있는 커스텀 이모지를 검색하고 다운로드하세요.",
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
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
