import { useQuery } from "@tanstack/react-query";

import type { Category } from "@/types/database";

const CATEGORIES_QUERY_KEY = ["categories"];

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch("/api/categories", { cache: "no-store" });
  if (!response.ok) return [];
  return response.json();
};

export const useCategories = () =>
  useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
  });
