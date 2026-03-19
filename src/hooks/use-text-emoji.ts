import { useCallback, useRef, useState } from "react";

import type { GifAnimationType, GifOptions } from "@/lib/text-emoji-gif";
import type { TextEmojiOptions } from "@/lib/text-emoji-renderer";

type OutputMode = "png" | "gif";

const DEFAULT_OPTIONS: TextEmojiOptions = {
  text: "",
  fontFamily: "Noto Sans KR",
  fontWeight: "700",
  textColor: "#ffffff",
  bgColor: "#4A90D9",
  bgTransparent: false,
  strokeEnabled: true,
  strokeColor: "#000000",
  strokeWidth: 3,
};

const DEFAULT_GIF_OPTIONS: GifOptions = {
  animationType: "typing" as GifAnimationType,
  charDelay: 300,
};

export const useTextEmoji = () => {
  const [options, setOptions] = useState<TextEmojiOptions>(DEFAULT_OPTIONS);
  const [outputMode, setOutputMode] = useState<OutputMode>("png");
  const [gifOptions, setGifOptions] = useState<GifOptions>(DEFAULT_GIF_OPTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateOption = useCallback(
    <K extends keyof TextEmojiOptions>(key: K, value: TextEmojiOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateGifOption = useCallback(
    <K extends keyof GifOptions>(key: K, value: GifOptions[K]) => {
      setGifOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetOptions = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
    setGifOptions(DEFAULT_GIF_OPTIONS);
    setOutputMode("png");
  }, []);

  return {
    options,
    outputMode,
    gifOptions,
    isGenerating,
    progress,
    canvasRef,
    setOptions,
    updateOption,
    setOutputMode,
    setGifOptions,
    updateGifOption,
    setIsGenerating,
    setProgress,
    resetOptions,
  };
};
