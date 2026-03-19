const CANVAS_SIZE = 128;
const PADDING = 6;
const DRAWABLE_SIZE = CANVAS_SIZE - PADDING * 2;

export type TextEmojiOptions = {
  text: string;
  fontFamily: string;
  fontWeight: "400" | "500" | "600" | "700" | "900";
  textColor: string;
  bgColor: string;
  bgTransparent: boolean;
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
};

/** 줄바꿈(\n) 기준으로 분리한 텍스트 줄 */
const getLines = (text: string): string[] => {
  const lines = text.split("\n").filter((l) => l.length > 0);
  return lines.length > 0 ? lines : [""];
};

/** generic 폰트는 따옴표 없이, 커스텀 폰트는 따옴표로 감싼다 */
const GENERIC_FONTS = new Set(["serif", "sans-serif", "monospace", "cursive", "fantasy"]);

const formatFontFamily = (fontFamily: string): string => {
  if (GENERIC_FONTS.has(fontFamily)) return fontFamily;
  return `'${fontFamily}'`;
};

/** 주어진 fontSize에서 모든 줄이 캔버스 안에 들어가는지 확인 */
const measureFit = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  lines: string[],
  fontFamily: string,
  fontWeight: string,
  fontSize: number
): boolean => {
  ctx.font = `${fontWeight} ${fontSize}px ${formatFontFamily(fontFamily)}, sans-serif`;

  const maxWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
  const lineHeight = fontSize * 1.2;
  const totalHeight = lineHeight * lines.length;

  return maxWidth <= DRAWABLE_SIZE && totalHeight <= DRAWABLE_SIZE;
};

/** 텍스트가 캔버스에 맞는 최대 fontSize를 이진 탐색 */
const findBestFontSize = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  lines: string[],
  fontFamily: string,
  fontWeight: string
): number => {
  let lo = 8;
  let hi = 120;

  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (measureFit(ctx, lines, fontFamily, fontWeight, mid)) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  return lo;
};

/**
 * Canvas에 텍스트 이모지를 렌더링합니다.
 * displayText를 전달하면 부분 텍스트(GIF 프레임용)를 렌더링합니다.
 */
export const renderTextEmoji = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  options: TextEmojiOptions,
  displayText?: string
): void => {
  const text = displayText ?? options.text;
  const lines = getLines(text);

  // 배경
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  if (!options.bgTransparent) {
    ctx.fillStyle = options.bgColor;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }

  if (!text.trim()) return;

  // 자동 폰트 사이즈 계산 (전체 텍스트 기준으로 크기 결정)
  const fullLines = getLines(options.text);
  const fontSize = findBestFontSize(ctx, fullLines, options.fontFamily, options.fontWeight);
  const font = `${options.fontWeight} ${fontSize}px ${formatFontFamily(options.fontFamily)}, sans-serif`;

  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineHeight = fontSize * 1.2;
  const totalHeight = lineHeight * lines.length;
  const startY = (CANVAS_SIZE - totalHeight) / 2 + lineHeight / 2;

  // 외곽선
  if (options.strokeEnabled && options.strokeWidth > 0) {
    ctx.strokeStyle = options.strokeColor;
    ctx.lineWidth = options.strokeWidth * 2;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;

    lines.forEach((line, i) => {
      ctx.strokeText(line, CANVAS_SIZE / 2, startY + i * lineHeight);
    });
  }

  // 텍스트
  ctx.fillStyle = options.textColor;
  lines.forEach((line, i) => {
    ctx.fillText(line, CANVAS_SIZE / 2, startY + i * lineHeight);
  });
};

/** Canvas를 PNG Blob으로 내보냅니다 */
export const canvasToPngBlob = async (
  canvas: HTMLCanvasElement | OffscreenCanvas
): Promise<Blob> => {
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: "image/png" });
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("PNG 변환 실패"));
    }, "image/png");
  });
};

export { CANVAS_SIZE };
