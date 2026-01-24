/**
 * Supabase Database Types
 *
 * 사용법:
 * 1. Supabase 대시보드에서 스키마를 생성한 후
 * 2. `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts`
 *    명령어로 타입을 자동 생성하거나
 * 3. 수동으로 아래 형식에 맞게 타입을 정의하세요
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      emojis: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string;
          image_path: string;
          category_id: string | null;
          uploader_id: string | null;
          is_animated: boolean;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url: string;
          image_path: string;
          category_id?: string | null;
          uploader_id?: string | null;
          is_animated?: boolean;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string;
          image_path?: string;
          category_id?: string | null;
          uploader_id?: string | null;
          is_animated?: boolean;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "emojis_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "emojis_uploader_id_fkey";
            columns: ["uploader_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      emoji_tags: {
        Row: {
          emoji_id: string;
          tag_id: string;
        };
        Insert: {
          emoji_id: string;
          tag_id: string;
        };
        Update: {
          emoji_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "emoji_tags_emoji_id_fkey";
            columns: ["emoji_id"];
            isOneToOne: false;
            referencedRelation: "emojis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "emoji_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      clicks: {
        Row: {
          id: string;
          emoji_id: string;
          user_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          emoji_id: string;
          user_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          emoji_id?: string;
          user_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clicks_emoji_id_fkey";
            columns: ["emoji_id"];
            isOneToOne: false;
            referencedRelation: "emojis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "clicks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      favorites: {
        Row: {
          user_id: string;
          emoji_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          emoji_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          emoji_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorites_emoji_id_fkey";
            columns: ["emoji_id"];
            isOneToOne: false;
            referencedRelation: "emojis";
            referencedColumns: ["id"];
          },
        ];
      };
      reports: {
        Row: {
          id: string;
          emoji_id: string;
          reporter_id: string | null;
          reason: "inappropriate" | "copyright" | "spam" | "other";
          description: string | null;
          status: "pending" | "reviewed" | "resolved" | "dismissed";
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          emoji_id: string;
          reporter_id?: string | null;
          reason: "inappropriate" | "copyright" | "spam" | "other";
          description?: string | null;
          status?: "pending" | "reviewed" | "resolved" | "dismissed";
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          emoji_id?: string;
          reporter_id?: string | null;
          reason?: "inappropriate" | "copyright" | "spam" | "other";
          description?: string | null;
          status?: "pending" | "reviewed" | "resolved" | "dismissed";
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_emoji_id_fkey";
            columns: ["emoji_id"];
            isOneToOne: false;
            referencedRelation: "emojis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_popular_emojis: {
        Args: {
          p_period?: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: {
          id: string;
          name: string;
          slug: string;
          image_url: string;
          image_path: string;
          category_id: string | null;
          is_animated: boolean;
          created_at: string;
          click_count: number;
        }[];
      };
      search_emojis: {
        Args: {
          p_query: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: {
          id: string;
          name: string;
          slug: string;
          image_url: string;
          image_path: string;
          category_id: string | null;
          is_animated: boolean;
          created_at: string;
        }[];
      };
    };
    Enums: {
      report_reason: "inappropriate" | "copyright" | "spam" | "other";
      report_status: "pending" | "reviewed" | "resolved" | "dismissed";
      user_role: "user" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
export type Functions<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T];

// Convenience types
export type Profile = Tables<"profiles">;
export type Category = Tables<"categories">;
export type Tag = Tables<"tags">;
export type Emoji = Tables<"emojis">;
export type EmojiTag = Tables<"emoji_tags">;
export type Click = Tables<"clicks">;
export type Favorite = Tables<"favorites">;
export type Report = Tables<"reports">;

// Extended types with relations
export type EmojiWithCategory = Emoji & {
  category: Category | null;
};

export type EmojiWithTags = Emoji & {
  tags: Tag[];
};

export type EmojiWithClickCount = Emoji & {
  click_count: number;
};

export type PopularEmoji = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  image_path: string;
  category_id: string | null;
  is_animated: boolean;
  created_at: string;
  click_count: number;
};

// Period type for popular emojis
export type PopularPeriod = "week" | "month" | "all";
