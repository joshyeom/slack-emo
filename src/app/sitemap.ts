import type { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://slack-emo.vercel.app";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("slug, created_at")
    .order("order", { ascending: true });

  const categoryEntries: MetadataRoute.Sitemap = (categories ?? []).map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: category.created_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
  ];
};

export default sitemap;
