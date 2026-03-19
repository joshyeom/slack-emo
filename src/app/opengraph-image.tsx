import { ImageResponse } from "next/og";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Slack Emo - 슬랙 커스텀 이모지 무료 다운로드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OgImage = async () => {
  const iconPath = join(process.cwd(), "public", "icon-192.png");
  const iconData = await readFile(iconPath);
  const iconBase64 = `data:image/png;base64,${iconData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        fontFamily: "sans-serif",
      }}
    >
      {}
      <img src={iconBase64} alt="Slack Emo" width={160} height={160} style={{ marginBottom: 32 }} />
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#ffffff",
          marginBottom: 16,
        }}
      >
        Slack Emo
      </div>
      <div
        style={{
          fontSize: 28,
          color: "#94a3b8",
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        슬랙 커스텀 이모지 무료 다운로드 & 공유 플랫폼
      </div>
    </div>,
    { ...size }
  );
};

export default OgImage;
