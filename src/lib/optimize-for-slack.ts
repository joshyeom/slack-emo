import { getFFmpeg } from "@/lib/video-to-gif";

const SLACK_EMOJI_SIZE = 128;
const SLACK_MAX_BYTES = 128 * 1024; // 128KB

/**
 * GIF를 FFmpeg로 128x128 리사이즈하고, 128KB 이하로 압축합니다.
 * 색상 수를 단계적으로 줄여 용량을 맞춥니다.
 */
const optimizeGif = async (blob: Blob): Promise<Blob> => {
  const ffmpeg = await getFFmpeg();

  const origin = window.location.origin;
  const utilUrl = `${origin}/ffmpeg/util/index.js`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fetchFile } = (await import(/* webpackIgnore: true */ utilUrl)) as any;

  await ffmpeg.writeFile("input.gif", await fetchFile(blob));

  // 색상 수를 단계적으로 줄여 128KB 이하 달성
  for (const colors of [256, 128, 64, 32]) {
    await ffmpeg.exec([
      "-i",
      "input.gif",
      "-vf",
      `scale=${SLACK_EMOJI_SIZE}:${SLACK_EMOJI_SIZE}:force_original_aspect_ratio=increase,crop=${SLACK_EMOJI_SIZE}:${SLACK_EMOJI_SIZE},split[s0][s1];[s0]palettegen=max_colors=${colors}[p];[s1][p]paletteuse=dither=bayer`,
      "-loop",
      "0",
      "-y",
      "output.gif",
    ]);

    const data = await ffmpeg.readFile("output.gif");
    const optimized = new Blob([new Uint8Array(data as Uint8Array)], {
      type: "image/gif",
    });

    if (optimized.size <= SLACK_MAX_BYTES) {
      await ffmpeg.deleteFile("input.gif");
      await ffmpeg.deleteFile("output.gif");
      return optimized;
    }
  }

  // 최소 색상으로도 초과 시 마지막 결과 반환
  const data = await ffmpeg.readFile("output.gif");
  await ffmpeg.deleteFile("input.gif");
  await ffmpeg.deleteFile("output.gif");
  return new Blob([new Uint8Array(data as Uint8Array)], { type: "image/gif" });
};

/**
 * 다운로드 시 이미지를 Slack 이모지 규격(128x128, 128KB 이하)으로 최적화합니다.
 * - PNG/JPEG/WebP: Canvas로 128x128 리사이즈 → 128KB 초과 시 quality 단계적 압축
 * - GIF: FFmpeg로 128x128 리사이즈 + 색상 수 조절로 128KB 이하 압축
 */
export const optimizeForSlack = async (blob: Blob): Promise<{ blob: Blob; extension: string }> => {
  // GIF → FFmpeg로 리사이즈 + 압축
  if (blob.type === "image/gif") {
    const optimized = await optimizeGif(blob);
    return { blob: optimized, extension: "gif" };
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
