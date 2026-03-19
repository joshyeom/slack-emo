"use client";

import { Download, Loader2, RotateCcw } from "lucide-react";

import type { GifAnimationType } from "@/lib/text-emoji-gif";
import { canvasToPngBlob } from "@/lib/text-emoji-renderer";

import { Button, Input, Label } from "@/components/ui";

import { useTextEmoji } from "@/hooks/use-text-emoji";

import { TextEmojiPreview } from "./TextEmojiPreview";

const FONT_OPTIONS = [
  { value: "Noto Sans KR", label: "노토 산스" },
  { value: "serif", label: "명조체" },
  { value: "monospace", label: "고정폭" },
  { value: "cursive", label: "필기체" },
] as const;

const WEIGHT_OPTIONS = [
  { value: "400", label: "보통" },
  { value: "500", label: "중간" },
  { value: "700", label: "굵게" },
  { value: "900", label: "매우 굵게" },
] as const;

const ANIMATION_OPTIONS = [
  { value: "typing", label: "타이핑" },
  { value: "blink", label: "깜빡임" },
] as const;

const SPEED_OPTIONS = [
  { value: 500, label: "느리게" },
  { value: 300, label: "보통" },
  { value: 150, label: "빠르게" },
] as const;

const COLOR_PRESETS = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const BG_PRESETS = [
  "#4A90D9",
  "#e74c3c",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e91e63",
  "#000000",
  "#ffffff",
];

export const TextEmojiGenerator = () => {
  const {
    options,
    outputMode,
    gifOptions,
    isGenerating,
    progress,
    canvasRef,
    updateOption,
    setOutputMode,
    updateGifOption,
    setIsGenerating,
    setProgress,
    resetOptions,
  } = useTextEmoji();

  const handleDownload = async () => {
    if (!options.text.trim()) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      let blob: Blob;
      let filename: string;

      if (outputMode === "gif") {
        const { generateTextEmojiGif } = await import("@/lib/text-emoji-gif");
        blob = await generateTextEmojiGif(options, gifOptions, setProgress);
        filename = `${options.text.trim().slice(0, 10)}.gif`;
      } else {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas를 찾을 수 없습니다");
        blob = await canvasToPngBlob(canvas);
        filename = `${options.text.trim().slice(0, 10)}.png`;
      }

      // 다운로드 트리거
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("이모지 생성 실패:", error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 미리보기 */}
      <div className="flex justify-center">
        <TextEmojiPreview options={options} canvasRef={canvasRef} />
      </div>

      {/* 텍스트 입력 */}
      <div className="space-y-2">
        <Label htmlFor="emoji-text">텍스트</Label>
        <Input
          id="emoji-text"
          placeholder="이모지 텍스트 입력 (예: 확인)"
          value={options.text}
          onChange={(e) => updateOption("text", e.target.value)}
          maxLength={10}
          className="text-center text-lg"
        />
        <p className="text-muted-foreground text-xs">
          줄바꿈은 Enter, 최대 10자. Slack 이모지에 적합한 짧은 텍스트를 추천합니다.
        </p>
      </div>

      {/* 폰트 & 굵기 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>폰트</Label>
          <select
            value={options.fontFamily}
            onChange={(e) => updateOption("fontFamily", e.target.value)}
            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>굵기</Label>
          <select
            value={options.fontWeight}
            onChange={(e) =>
              updateOption("fontWeight", e.target.value as "400" | "500" | "600" | "700" | "900")
            }
            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {WEIGHT_OPTIONS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 글자색 */}
      <div className="space-y-2">
        <Label>글자색</Label>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => updateOption("textColor", color)}
                className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: options.textColor === color ? "#3b82f6" : "transparent",
                }}
              />
            ))}
          </div>
          <input
            type="color"
            value={options.textColor}
            onChange={(e) => updateOption("textColor", e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border-0"
          />
        </div>
      </div>

      {/* 배경색 */}
      <div className="space-y-2">
        <Label>배경</Label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateOption("bgTransparent", !options.bgTransparent)}
            className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor: options.bgTransparent ? "#3b82f6" : "transparent",
              color: options.bgTransparent ? "#ffffff" : undefined,
              borderColor: options.bgTransparent ? "#3b82f6" : undefined,
            }}
          >
            투명
          </button>
          {!options.bgTransparent && (
            <>
              <div className="flex gap-1">
                {BG_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateOption("bgColor", color)}
                    className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: options.bgColor === color ? "#3b82f6" : "transparent",
                    }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={options.bgColor}
                onChange={(e) => updateOption("bgColor", e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border-0"
              />
            </>
          )}
        </div>
      </div>

      {/* 외곽선 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Label>외곽선</Label>
          <button
            type="button"
            onClick={() => updateOption("strokeEnabled", !options.strokeEnabled)}
            className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor: options.strokeEnabled ? "#3b82f6" : "transparent",
              color: options.strokeEnabled ? "#ffffff" : undefined,
              borderColor: options.strokeEnabled ? "#3b82f6" : undefined,
            }}
          >
            {options.strokeEnabled ? "ON" : "OFF"}
          </button>
        </div>
        {options.strokeEnabled && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">색상</span>
              <input
                type="color"
                value={options.strokeColor}
                onChange={(e) => updateOption("strokeColor", e.target.value)}
                className="h-7 w-7 cursor-pointer rounded border-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">두께</span>
              <input
                type="range"
                min={1}
                max={8}
                value={options.strokeWidth}
                onChange={(e) => updateOption("strokeWidth", Number(e.target.value))}
                className="w-24"
              />
              <span className="text-muted-foreground text-xs">{options.strokeWidth}px</span>
            </div>
          </div>
        )}
      </div>

      {/* 출력 모드 */}
      <div className="space-y-2">
        <Label>출력 형식</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOutputMode("png")}
            className="flex-1 rounded-md border py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: outputMode === "png" ? "#3b82f6" : "transparent",
              color: outputMode === "png" ? "#ffffff" : undefined,
              borderColor: outputMode === "png" ? "#3b82f6" : undefined,
            }}
          >
            정적 PNG
          </button>
          <button
            type="button"
            onClick={() => setOutputMode("gif")}
            className="flex-1 rounded-md border py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: outputMode === "gif" ? "#3b82f6" : "transparent",
              color: outputMode === "gif" ? "#ffffff" : undefined,
              borderColor: outputMode === "gif" ? "#3b82f6" : undefined,
            }}
          >
            애니메이션 GIF
          </button>
        </div>
      </div>

      {/* GIF 옵션 */}
      {outputMode === "gif" && (
        <div className="bg-muted/50 space-y-3 rounded-lg p-4">
          <div className="space-y-2">
            <Label>애니메이션</Label>
            <div className="flex gap-2">
              {ANIMATION_OPTIONS.map((anim) => (
                <button
                  key={anim.value}
                  type="button"
                  onClick={() => updateGifOption("animationType", anim.value as GifAnimationType)}
                  className="rounded-md border px-3 py-1.5 text-sm transition-colors"
                  style={{
                    backgroundColor:
                      gifOptions.animationType === anim.value ? "#3b82f6" : "transparent",
                    color: gifOptions.animationType === anim.value ? "#ffffff" : undefined,
                    borderColor: gifOptions.animationType === anim.value ? "#3b82f6" : undefined,
                  }}
                >
                  {anim.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>속도</Label>
            <div className="flex gap-2">
              {SPEED_OPTIONS.map((speed) => (
                <button
                  key={speed.value}
                  type="button"
                  onClick={() => updateGifOption("charDelay", speed.value)}
                  className="rounded-md border px-3 py-1.5 text-sm transition-colors"
                  style={{
                    backgroundColor:
                      gifOptions.charDelay === speed.value ? "#3b82f6" : "transparent",
                    color: gifOptions.charDelay === speed.value ? "#ffffff" : undefined,
                    borderColor: gifOptions.charDelay === speed.value ? "#3b82f6" : undefined,
                  }}
                >
                  {speed.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            GIF 생성 시 FFmpeg를 사용합니다. 첫 사용 시 로딩에 시간이 걸릴 수 있습니다.
          </p>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownload}
          disabled={!options.text.trim() || isGenerating}
          className="flex-1"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              생성 중... {progress > 0 ? `${progress}%` : ""}
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              다운로드 ({outputMode.toUpperCase()})
            </>
          )}
        </Button>
        <Button variant="outline" size="lg" onClick={resetOptions}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
