import { CANVAS_SIZE, renderTextEmoji } from "./text-emoji-renderer";
import type { TextEmojiOptions } from "./text-emoji-renderer";
import { getFFmpeg } from "./video-to-gif";

export type GifOptions = {
  /** 글자당 딜레이 (ms) */
  charDelay: number;
};

/**
 * 타이핑 애니메이션: 한 글자씩 등장하는 프레임 텍스트 목록 생성
 */
const generateTypingFrames = (text: string): string[] => {
  const chars = [...text]; // 한글 자모 분리 방지
  const frames: string[] = [];

  for (let i = 1; i <= chars.length; i++) {
    frames.push(chars.slice(0, i).join(""));
  }

  // 마지막 프레임(완성 텍스트)을 추가로 유지
  frames.push(text);
  frames.push(text);

  return frames;
};

/**
 * 텍스트 이모지 → 타이핑 애니메이션 GIF 생성
 */
export const generateTextEmojiGif = async (
  emojiOptions: TextEmojiOptions,
  gifOptions: GifOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const frameTexts = generateTypingFrames(emojiOptions.text);
  const frameCount = frameTexts.length;

  onProgress?.(5);

  // 각 프레임을 PNG로 렌더링
  const canvas = new OffscreenCanvas(CANVAS_SIZE, CANVAS_SIZE);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D 컨텍스트를 생성할 수 없습니다");

  // 폰트 로딩 대기
  await document.fonts.ready;

  const framePngs: Uint8Array[] = [];

  for (let i = 0; i < frameCount; i++) {
    renderTextEmoji(ctx, emojiOptions, frameTexts[i]);
    const blob = await canvas.convertToBlob({ type: "image/png" });
    const buffer = await blob.arrayBuffer();
    framePngs.push(new Uint8Array(buffer));
    onProgress?.(5 + Math.round((i / frameCount) * 30));
  }

  onProgress?.(40);

  // FFmpeg로 프레임들을 GIF로 결합
  const ffmpeg = await getFFmpeg((p) => {
    onProgress?.(40 + Math.round(p * 0.5));
  });

  // 프레임 파일 쓰기
  for (let i = 0; i < framePngs.length; i++) {
    await ffmpeg.writeFile(`frame_${String(i).padStart(3, "0")}.png`, framePngs[i]);
  }

  // fps 계산: charDelay ms당 1프레임
  const fps = Math.max(1, Math.round(1000 / gifOptions.charDelay));

  // 프레임 → GIF 변환 (palette 생성 + 적용)
  await ffmpeg.exec([
    "-framerate",
    String(fps),
    "-i",
    "frame_%03d.png",
    "-vf",
    `split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer`,
    "-loop",
    "0",
    "output.gif",
  ]);

  onProgress?.(95);

  const data = await ffmpeg.readFile("output.gif");
  const gifBlob = new Blob([new Uint8Array(data as Uint8Array)], { type: "image/gif" });

  // 정리
  for (let i = 0; i < framePngs.length; i++) {
    await ffmpeg.deleteFile(`frame_${String(i).padStart(3, "0")}.png`);
  }
  await ffmpeg.deleteFile("output.gif");

  onProgress?.(100);

  return gifBlob;
};
