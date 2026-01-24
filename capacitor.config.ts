import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // TODO: 앱 ID를 변경하세요 (예: com.yourcompany.yourapp)
  appId: "com.example.app",
  // TODO: 앱 이름을 변경하세요
  appName: "My App",
  webDir: "out",
  server: {
    // 개발 중에는 로컬 서버 사용, 배포 후 Vercel URL로 변경
    // url: 'https://your-vercel-url.vercel.app/',
    // cleartext: true
  },
};

export default config;
