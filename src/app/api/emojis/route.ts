import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Disable Next.js server-side caching - use TanStack Query for client caching
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB input limit

// Generate ASCII-only slug for file paths (Supabase Storage doesn't allow non-ASCII)
const generateFileSlug = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `emoji-${timestamp}-${random}`;
};

// GET /api/emojis - Fetch all approved emojis
export const GET = async () => {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("emojis")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch emojis" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

// POST /api/emojis - Upload new emoji (authenticated only)
export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;

    if (!file || !name) {
      return NextResponse.json({ error: "File and name are required" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/gif", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PNG, GIF, JPEG, WebP" },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB for input)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 });
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
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: `Failed to upload image: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("emojis").getPublicUrl(filePath);

    // Insert emoji record
    const { data: emoji, error: insertError } = await supabase
      .from("emojis")
      .insert({
        name,
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
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Failed to save emoji" }, { status: 500 });
    }

    return NextResponse.json({ emoji }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
