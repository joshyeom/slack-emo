"use client";

import { useCallback, useState } from "react";

import { resizeImageFile } from "@/lib/resize-image";

import { useUploadEmoji } from "./use-emojis";

const ALLOWED_TYPES = ["image/png", "image/gif", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const useEmojiUploadForm = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useUploadEmoji();

  const resetForm = useCallback(() => {
    setFile(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setName("");
    setCategory("");
    setError(null);
  }, []);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("PNG, GIF, JPEG, WebP 파일만 업로드 가능합니다");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("파일 크기는 2MB 이하여야 합니다");
      return;
    }

    setError(null);

    try {
      const resized = await resizeImageFile(selectedFile);
      setFile(resized);
      setPreview(URL.createObjectURL(resized));
    } catch {
      setError("이미지 처리에 실패했습니다");
    }
  }, []);

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
        setError("이미지와 이름을 입력해주세요");
        return;
      }

      setError(null);

      uploadMutation.mutate(
        { file, name: name.trim(), category: category.trim() || undefined },
        {
          onSuccess: () => {
            resetForm();
            setOpen(false);
          },
          onError: (err) => {
            setError(err instanceof Error ? err.message : "업로드에 실패했습니다");
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
    error,
    isDragging,
    isLoading: uploadMutation.isPending,
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
