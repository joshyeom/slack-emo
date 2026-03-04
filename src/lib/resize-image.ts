const EMOJI_SIZE = 128;

/**
 * 클라이언트에서 이미지를 128x128로 리사이즈합니다.
 * - GIF: 애니메이션 프레임 유지를 위해 리사이즈 없이 원본 반환
 * - 그 외: Canvas API로 128x128 PNG 변환
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

    ctx.drawImage(bitmap, x, y, w, h);

    const blob = await canvas.convertToBlob({ type: "image/png" });
    return new File([blob], file.name.replace(/\.\w+$/, ".png"), {
      type: "image/png",
    });
  } finally {
    bitmap.close();
  }
};
