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
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
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
      // TODO: 여기에 필요한 테이블 타입을 추가하세요
      // items: {
      //   Row: { ... };
      //   Insert: { ... };
      //   Update: { ... };
      //   Relationships: [];
      // };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      // TODO: 필요한 enum 타입 정의
      // status: "pending" | "active" | "completed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
