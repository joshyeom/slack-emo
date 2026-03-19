const SLACK_EMOJI_SIZE = 128;
const SLACK_MAX_BYTES = 128 * 1024; // 128KB

/**
 * 다운로드 시 이미지를 Slack 이모지 규격(128x128, 128KB 이하)으로 최적화합니다.
 * - PNG/JPEG/WebP: Canvas로 128x128 리사이즈 → 128KB 초과 시 quality 단계적 압축
 * - GIF: 128KB 이하면 원본, 초과 시 null 반환 (호출부에서 처리)
 */
export const optimizeForSlack = async (
  blob: Blob
): Promise<{ blob: Blob; extension: string; skipped?: boolean }> => {
  // GIF는 클라이언트에서 프레임 단위 리사이즈가 어려우므로
  // 용량만 체크하고, 초과 시 skipped 플래그로 알림
  if (blob.type === "image/gif") {
    if (blob.size <= SLACK_MAX_BYTES) {
      return { blob, extension: "gif" };
    }
    return { blob, extension: "gif", skipped: true };
  }

  // PNG/JPEG/WebP → 128x128 리사이즈
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = new OffscreenCanvas(SLACK_EMOJI_SIZE, SLACK_EMOJI_SIZE);
    const ctx = canvas.getContext("2d")!;

    const scale = Math.min(SLACK_EMOJI_SIZE / bitmap.width, SLACK_EMOJI_SIZE / bitmap.height);
    const w = bitmap.width * scale;
    const h = bitmap.height * scale;
    const x = (SLACK_EMOJI_SIZE - w) / 2;
    const y = (SLACK_EMOJI_SIZE - h) / 2;

    // 투명 배경 유지를 위해 clear
    ctx.clearRect(0, 0, SLACK_EMOJI_SIZE, SLACK_EMOJI_SIZE);
    ctx.drawImage(bitmap, x, y, w, h);

    // 1차: PNG로 시도 (투명 배경 유지)
    const pngBlob = await canvas.convertToBlob({ type: "image/png" });
    if (pngBlob.size <= SLACK_MAX_BYTES) {
      return { blob: pngBlob, extension: "png" };
    }

    // 2차: WebP quality를 단계적으로 낮춰 128KB 이하 달성
    for (const quality of [0.9, 0.8, 0.7, 0.5, 0.3]) {
      const webpBlob = await canvas.convertToBlob({
        type: "image/webp",
        quality,
      });
      if (webpBlob.size <= SLACK_MAX_BYTES) {
        return { blob: webpBlob, extension: "webp" };
      }
    }

    // 3차: JPEG 최저 quality (투명 배경은 손실되지만 용량 확보)
    const jpegBlob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 0.3,
    });
    return { blob: jpegBlob, extension: "jpg" };
  } finally {
    bitmap.close();
  }
};
