"use client";

import Image from "next/image";

import { Loader2, Plus, Upload, X } from "lucide-react";

import { Button, Input, Label } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useEmojiUploadForm } from "@/hooks";

import { CategoryInput } from "./CategoryInput";

export const EmojiUploadDialog = () => {
  const {
    open,
    file,
    preview,
    name,
    category,
    error,
    isDragging,
    isLoading,
    setName,
    setCategory,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmit,
    handleOpenChange,
    clearPreview,
  } = useEmojiUploadForm();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add emoji</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이모지 추가</DialogTitle>
          <DialogDescription>새로운 이모지를 업로드합니다</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Area */}
          <div className="space-y-2">
            <Label>이미지</Label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative flex min-h-[120px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
            >
              <input
                type="file"
                accept="image/png,image/gif,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />

              {preview ? (
                <div className="relative flex flex-col items-center gap-2 p-4">
                  <div className="relative h-16 w-16">
                    <Image src={preview} alt="Preview" fill className="object-contain" />
                  </div>
                  <span className="text-muted-foreground text-xs">{file?.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-1 -right-1 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearPreview();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-4">
                  <Upload className="text-muted-foreground h-8 w-8" />
                  <span className="text-muted-foreground text-sm">
                    클릭하거나 드래그하여 업로드
                  </span>
                  <span className="text-muted-foreground text-xs">
                    PNG, GIF, JPEG, WebP (최대 2MB, 128x128 리사이징)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="emoji-name">이름</Label>
            <Input
              id="emoji-name"
              placeholder="이모지 이름 (예: party-parrot)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Category Input */}
          <div className="space-y-2">
            <Label>카테고리</Label>
            <CategoryInput value={category} onChange={setCategory} disabled={isLoading} />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading || !file || !name.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                "업로드"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
