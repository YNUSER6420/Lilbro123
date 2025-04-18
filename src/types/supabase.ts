export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          book_id: string | null;
          created_at: string | null;
          id: string;
          note: string | null;
          page_number: number;
          user_id: string | null;
        };
        Insert: {
          book_id?: string | null;
          created_at?: string | null;
          id?: string;
          note?: string | null;
          page_number: number;
          user_id?: string | null;
        };
        Update: {
          book_id?: string | null;
          created_at?: string | null;
          id?: string;
          note?: string | null;
          page_number?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
        ];
      };
      books: {
        Row: {
          audio_url: string | null;
          category: string | null;
          content: string;
          cover_image: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          published: boolean | null;
          reading_time: number | null;
          title: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          audio_url?: string | null;
          category?: string | null;
          content: string;
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          published?: boolean | null;
          reading_time?: number | null;
          title: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          audio_url?: string | null;
          category?: string | null;
          content?: string;
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          published?: boolean | null;
          reading_time?: number | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      narration_settings: {
        Row: {
          id: string;
          book_id: string;
          user_id: string;
          voice: string;
          speed: number;
          quality: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          book_id: string;
          user_id: string;
          voice?: string;
          speed?: number;
          quality?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          book_id?: string;
          user_id?: string;
          voice?: string;
          speed?: number;
          quality?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "narration_settings_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
        ];
      };
      reading_progress: {
        Row: {
          book_id: string | null;
          current_page: number;
          id: string;
          last_read_at: string | null;
          percentage_complete: number | null;
          total_pages: number;
          user_id: string | null;
        };
        Insert: {
          book_id?: string | null;
          current_page?: number;
          id?: string;
          last_read_at?: string | null;
          percentage_complete?: number | null;
          total_pages: number;
          user_id?: string | null;
        };
        Update: {
          book_id?: string | null;
          current_page?: number;
          id?: string;
          last_read_at?: string | null;
          percentage_complete?: number | null;
          total_pages?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reading_progress_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
