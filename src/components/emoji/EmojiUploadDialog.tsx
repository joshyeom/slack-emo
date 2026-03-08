"use client";

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
    isDragging,
    isLoading,
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
  } = useEmojiUploadForm();

  const isBusy = isLoading || isConverting;

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
            <Label>이미지 / 동영상</Label>
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
                accept="image/png,image/gif,image/jpeg,image/webp,video/mp4,video/quicktime,video/webm"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={isBusy}
              />

              {isConverting ? (
                <div className="flex flex-col items-center gap-3 p-4">
                  <Loader2 className="text-primary h-8 w-8 animate-spin" />
                  <span className="text-muted-foreground text-sm">
                    GIF 변환 중... {convertProgress}%
                  </span>
                  <div className="bg-muted h-2 w-48 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${convertProgress}%` }}
                    />
                  </div>
                </div>
              ) : preview ? (
                <div className="relative flex flex-col items-center gap-2 p-4">
                  <div className="relative h-16 w-16">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="h-full w-full object-contain" />
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
                    이미지, 혹은 영상을 업로드 해주세요
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
              disabled={isBusy}
            />
          </div>

          {/* Category Input */}
          <div className="space-y-2">
            <Label>카테고리</Label>
            <CategoryInput value={category} onChange={setCategory} disabled={isBusy} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isBusy}
            >
              취소
            </Button>
            <Button type="submit" disabled={isBusy || !file || !name.trim()}>
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
