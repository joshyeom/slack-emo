import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Emoji } from "@/types/database";

const EMOJIS_QUERY_KEY = ["emojis"];

// Fetch all emojis (no-store to bypass browser cache, rely on TanStack Query)
const fetchEmojis = async (): Promise<Emoji[]> => {
  const response = await fetch("/api/emojis", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch emojis");
  }
  return response.json();
};

// Upload emoji
type UploadEmojiParams = {
  file: File;
  name: string;
};

const uploadEmoji = async ({ file, name }: UploadEmojiParams): Promise<Emoji> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);

  const response = await fetch("/api/emojis", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to upload emoji");
  }

  return data.emoji;
};

// Hook: Get all emojis
export const useEmojis = () =>
  useQuery({
    queryKey: EMOJIS_QUERY_KEY,
    queryFn: fetchEmojis,
  });

// Hook: Upload emoji with cache invalidation
export const useUploadEmoji = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadEmoji,
    onSuccess: () => {
      // Invalidate and refetch emojis list
      queryClient.invalidateQueries({ queryKey: EMOJIS_QUERY_KEY });
    },
  });
};
