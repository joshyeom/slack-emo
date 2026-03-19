const EMOJI_SIZE = 128;
const SLACK_MAX_BYTES = 128 * 1024; // 128KB

/**
 * 클라이언트에서 이미지를 128x128, 128KB 이하로 리사이즈합니다.
 * - GIF: 애니메이션 프레임 유지를 위해 리사이즈 없이 원본 반환
 * - 그 외: Canvas API로 128x128 변환 → 128KB 초과 시 quality 단계적 압축
 */
export const resizeImageFile = async (file: File): Promise<File> => {
  if (file.type === "image/gif") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  try {
    const canvas = new OffscreenCanvas(EMOJI_SIZE, EMOJI_SIZE);
    const ctx = canvas.getContext("2d")!;

    const scale = Math.min(EMOJI_SIZE / bitmap.width, EMOJI_SIZE / bitmap.height);
    const w = bitmap.width * scale;
    const h = bitmap.height * scale;
    const x = (EMOJI_SIZE - w) / 2;
    const y = (EMOJI_SIZE - h) / 2;

    ctx.clearRect(0, 0, EMOJI_SIZE, EMOJI_SIZE);
    ctx.drawImage(bitmap, x, y, w, h);

    // 1차: PNG (투명 배경 유지)
    const pngBlob = await canvas.convertToBlob({ type: "image/png" });
    if (pngBlob.size <= SLACK_MAX_BYTES) {
      return new File([pngBlob], file.name.replace(/\.\w+$/, ".png"), {
        type: "image/png",
      });
    }

    // 2차: WebP quality 단계적 압축
    for (const quality of [0.9, 0.8, 0.7, 0.5, 0.3]) {
      const webpBlob = await canvas.convertToBlob({ type: "image/webp", quality });
      if (webpBlob.size <= SLACK_MAX_BYTES) {
        return new File([webpBlob], file.name.replace(/\.\w+$/, ".webp"), {
          type: "image/webp",
        });
      }
    }

    // 3차: JPEG 최저 quality
    const jpegBlob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.3 });
    return new File([jpegBlob], file.name.replace(/\.\w+$/, ".jpg"), {
      type: "image/jpeg",
    });
  } finally {
    bitmap.close();
  }
};
