"use client";

import { useEffect, useRef } from "react";

import { CANVAS_SIZE, renderTextEmoji } from "@/lib/text-emoji-renderer";
import type { TextEmojiOptions } from "@/lib/text-emoji-renderer";

type TextEmojiPreviewProps = {
  options: TextEmojiOptions;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export const TextEmojiPreview = ({ options, canvasRef }: TextEmojiPreviewProps) => {
  const fontReadyRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      renderTextEmoji(ctx, options);
    };

    if (fontReadyRef.current) {
      draw();
    } else {
      document.fonts.ready.then(() => {
        fontReadyRef.current = true;
        draw();
      });
    }
  }, [options, canvasRef]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative rounded-lg border-2 border-dashed border-gray-300 p-2 dark:border-gray-600"
        style={{
          background: options.bgTransparent
            ? "repeating-conic-gradient(#d1d5db 0% 25%, transparent 0% 50%) 50% / 16px 16px"
            : undefined,
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="h-32 w-32"
          style={{ imageRendering: "auto" }}
        />
      </div>
      <p className="text-muted-foreground text-xs">128 × 128 px</p>
    </div>
  );
};
