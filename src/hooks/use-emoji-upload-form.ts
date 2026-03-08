"use client";

import { useCallback, useState } from "react";

import { toast } from "sonner";

import { reportError } from "@/lib/report-error";
import { resizeImageFile } from "@/lib/resize-image";
import { convertVideoToGif, isVideoFile, validateVideoFile } from "@/lib/video-to-gif";

import { useUploadEmoji } from "./use-emojis";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/gif", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export const useEmojiUploadForm = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);

  const uploadMutation = useUploadEmoji();

  const resetForm = useCallback(() => {
    setFile(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setName("");
    setCategory("");

    setIsConverting(false);
    setConvertProgress(0);
  }, []);

  const setNameFromFile = useCallback((fileName: string) => {
    const normalized = fileName.normalize("NFC");
    const fileNameWithoutExt = normalized.replace(/\.[^.]+$/, "");
    setName(fileNameWithoutExt);
  }, []);

  const handleImageFile = useCallback(
    async (selectedFile: File) => {
      if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
        toast.error("PNG, GIF, JPEG, WebP 이미지만 업로드 가능합니다");
        return;
      }

      if (selectedFile.size > MAX_IMAGE_SIZE) {
        toast.error("이미지 크기는 2MB 이하여야 합니다");
        return;
      }

      setNameFromFile(selectedFile.name);

      try {
        const resized = await resizeImageFile(selectedFile);
        setFile(resized);
        setPreview(URL.createObjectURL(resized));
      } catch {
        toast.error("이미지 처리에 실패했습니다");
      }
    },
    [setNameFromFile]
  );

  const handleVideoFile = useCallback(
    async (selectedFile: File) => {
      const videoError = validateVideoFile(selectedFile);
      if (videoError) {
        toast.error(videoError);
        return;
      }

      setNameFromFile(selectedFile.name);
      setIsConverting(true);
      setConvertProgress(0);

      try {
        const gif = await convertVideoToGif(selectedFile, {
          onProgress: setConvertProgress,
        });
        setFile(gif);
        setPreview(URL.createObjectURL(gif));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "동영상 변환에 실패했습니다";
        toast.error(errorMessage);
        console.error("[VideoToGif]", errorMessage, err);
        reportError({
          type: "video_to_gif",
          message: errorMessage,
          metadata: {
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
          },
        });
      } finally {
        setIsConverting(false);
        setConvertProgress(0);
      }
    },
    [setNameFromFile]
  );

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      if (isVideoFile(selectedFile)) {
        await handleVideoFile(selectedFile);
      } else {
        await handleImageFile(selectedFile);
      }
    },
    [handleImageFile, handleVideoFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!file || !name.trim()) {
        toast.error("이미지와 이름을 입력해주세요");
        return;
      }

      uploadMutation.mutate(
        { file, name: name.trim(), category: category.trim() || undefined },
        {
          onSuccess: () => {
            resetForm();
            setOpen(false);
          },
          onError: (err) => {
            toast.error(err instanceof Error ? err.message : "업로드에 실패했습니다");
          },
        }
      );
    },
    [file, name, category, uploadMutation, resetForm]
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetForm();
      }
    },
    [resetForm]
  );

  const clearPreview = useCallback(() => {
    setFile(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  return {
    open,
    file,
    preview,
    name,
    category,
    isDragging,
    isLoading: uploadMutation.isPending,
    isConverting,
    convertProgress,
    setName,
    setCategory,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmit,
    handleOpenChange,
    clearPreview,
  };
};
