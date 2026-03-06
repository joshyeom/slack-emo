import { NextRequest, NextResponse } from "next/server";

import { apiError, withErrorHandler } from "@/lib/api/error";
import { checkRateLimit } from "@/lib/api/rate-limit";
import { validateEmojiFile, validateEmojiName } from "@/lib/api/validation";
import { createClient } from "@/lib/supabase/server";

// Disable Next.js server-side caching - use TanStack Query for client caching
export const dynamic = "force-dynamic";

// Generate ASCII-only slug for file paths (Supabase Storage doesn't allow non-ASCII)
const generateFileSlug = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `emoji-${timestamp}-${random}`;
};

// GET /api/emojis - Fetch all approved emojis
export const GET = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient();
  if (!supabase) {
    throw apiError("DB_ERROR", undefined, "Database connection failed");
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 200, 200);
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

  const { data, error } = await supabase
    .from("emojis")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw apiError("DB_ERROR", undefined, `Fetch error: ${error.message}`);
  }

  const response = NextResponse.json(data || []);
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
  return response;
});

// POST /api/emojis - Upload new emoji (authenticated only)
export const POST = withErrorHandler(async (request: NextRequest) => {
  // Rate limit: 1분에 10회
  const rateLimited = checkRateLimit(request, { maxRequests: 10 });
  if (rateLimited) return rateLimited;

  const supabase = await createClient();
  if (!supabase) {
    throw apiError("DB_ERROR", undefined, "Database connection failed");
  }

  // Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw apiError("UNAUTHORIZED");
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const name = formData.get("name") as string | null;

  if (!file || !name) {
    throw apiError("BAD_REQUEST", "이미지와 이름은 필수입니다");
  }

  // Validate file
  const fileError = validateEmojiFile(file);
  if (fileError) {
    throw apiError("VALIDATION_ERROR", fileError);
  }

  // Validate name
  const nameError = validateEmojiName(name);
  if (nameError) {
    throw apiError("VALIDATION_ERROR", nameError);
  }

  // Image is already resized on the client (128x128)
  const isAnimated = file.type === "image/gif";

  // Generate unique slug for file storage (ASCII only)
  const format = isAnimated ? "gif" : "png";
  const slug = generateFileSlug();
  const filePath = `${slug}.${format}`;
  const contentType = file.type;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("emojis")
    .upload(filePath, await file.arrayBuffer(), {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw apiError("UPLOAD_FAILED", undefined, `Storage upload: ${uploadError.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("emojis").getPublicUrl(filePath);

  // Insert emoji record
  const { data: emoji, error: insertError } = await supabase
    .from("emojis")
    .insert({
      name: name.trim(),
      slug,
      image_url: publicUrl,
      image_path: filePath,
      is_animated: isAnimated,
      is_approved: true,
      uploader_id: user.id,
    })
    .select()
    .single();

  if (insertError) {
    // Cleanup uploaded file if insert fails
    await supabase.storage.from("emojis").remove([filePath]);
    throw apiError("DB_ERROR", undefined, `Insert error: ${insertError.message}`);
  }

  return NextResponse.json({ emoji }, { status: 201 });
});
