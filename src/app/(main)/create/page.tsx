"use client";

import { useState } from "react";

import Image from "next/image";

import { Loader2, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button, Input, Label } from "@/components/ui";

export default function CreatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      // Auto-fill name from filename
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setName(fileName.toLowerCase().replace(/[^a-z0-9-_]/g, "-"));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;

    setIsUploading(true);

    try {
      // TODO: Implement upload API
      console.log("Upload:", { file, name, tags });
      alert("Upload feature coming soon!");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setName("");
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Upload Emoji</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <Label>Image</Label>
          <div className="mt-2">
            {preview ? (
              <div className="relative inline-block">
                <div className="bg-muted relative h-32 w-32 rounded-lg border">
                  <Image src={preview} alt="Preview" fill className="object-contain p-2" />
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                className={cn(
                  "flex h-32 w-32 cursor-pointer flex-col items-center justify-center",
                  "rounded-lg border-2 border-dashed",
                  "hover:bg-muted transition-colors"
                )}
              >
                <Upload className="text-muted-foreground h-8 w-8" />
                <span className="text-muted-foreground mt-2 text-xs">PNG, GIF</span>
                <input
                  type="file"
                  accept="image/png,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">128x128 recommended. Max 256KB.</p>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"))}
            placeholder="emoji-name"
            className="mt-2"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Will be used as :{name || "emoji-name"}:
          </p>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tags (press Enter)"
            className="mt-2"
            disabled={tags.length >= 5}
          />
          <p className="text-muted-foreground mt-1 text-xs">Up to 5 tags. Used for search.</p>
        </div>

        {/* Submit */}
        <Button type="submit" disabled={!file || !name || isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
