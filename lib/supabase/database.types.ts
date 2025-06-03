export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          location: string | null
          website: string | null
          role: "user" | "analyst" | "admin"
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          website?: string | null
          role?: "user" | "analyst" | "admin"
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          website?: string | null
          role?: "user" | "analyst" | "admin"
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string | null
          address: string
          network: string | null
          provider: string | null
          is_primary: boolean | null
          verified: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          address: string
          network?: string | null
          provider?: string | null
          is_primary?: boolean | null
          verified?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          address?: string
          network?: string | null
          provider?: string | null
          is_primary?: boolean | null
          verified?: boolean | null
          created_at?: string
        }
      }
      wallet_balances: {
        Row: {
          id: string
          address: string
          strk_balance: number
          last_synced_at: string
        }
        Insert: {
          id?: string
          address: string
          strk_balance?: number
          last_synced_at?: string
        }
        Update: {
          id?: string
          address?: string
          strk_balance?: number
          last_synced_at?: string
        }
      }
      queries: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          sql_content: string
          visibility: "public" | "private" | "unlisted"
          forked_from: string | null
          tags: string[] | null
          view_count: number | null
          star_count: number | null
          fork_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          sql_content: string
          visibility?: "public" | "private" | "unlisted"
          forked_from?: string | null
          tags?: string[] | null
          view_count?: number | null
          star_count?: number | null
          fork_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          sql_content?: string
          visibility?: "public" | "private" | "unlisted"
          forked_from?: string | null
          tags?: string[] | null
          view_count?: number | null
          star_count?: number | null
          fork_count?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      notebooks: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          file_url: string | null
          visibility: "public" | "private" | "unlisted"
          forked_from: string | null
          tags: string[] | null
          view_count: number | null
          star_count: number | null
          fork_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          file_url?: string | null
          visibility?: "public" | "private" | "unlisted"
          forked_from?: string | null
          tags?: string[] | null
          view_count?: number | null
          star_count?: number | null
          fork_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          file_url?: string | null
          visibility?: "public" | "private" | "unlisted"
          forked_from?: string | null
          tags?: string[] | null
          view_count?: number | null
          star_count?: number | null
          fork_count?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      hackathons: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          prize_amount: number | null
          prize_currency: string | null
          status: "upcoming" | "active" | "ended"
          max_participants: number | null
          organizer_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          prize_amount?: number | null
          prize_currency?: string | null
          status?: "upcoming" | "active" | "ended"
          max_participants?: number | null
          organizer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          prize_amount?: number | null
          prize_currency?: string | null
          status?: "upcoming" | "active" | "ended"
          max_participants?: number | null
          organizer_id?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: "query_fork" | "notebook_comment" | "project_application" | "hackathon_update" | "payment_received"
          title: string
          message: string
          metadata: Json | null
          read: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: "query_fork" | "notebook_comment" | "project_application" | "hackathon_update" | "payment_received"
          title: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: "query_fork" | "notebook_comment" | "project_application" | "hackathon_update" | "payment_received"
          title?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          created_at?: string
        }
      }
      contract_extractions: {
        Row: {
          id: string
          user_id: string | null
          contract_address: string | null
          file_url: string | null
          extraction_data: Json | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          contract_address?: string | null
          file_url?: string | null
          extraction_data?: Json | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          contract_address?: string | null
          file_url?: string | null
          extraction_data?: Json | null
          status?: string | null
          created_at?: string
        }
      }
      analyst_profiles: {
        Row: {
          id: string
          user_id: string | null
          hourly_rate: number | null
          skills: string[] | null
          experience_years: number | null
          portfolio_url: string | null
          availability_status: string | null
          rating: number | null
          review_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          hourly_rate?: number | null
          skills?: string[] | null
          experience_years?: number | null
          portfolio_url?: string | null
          availability_status?: string | null
          rating?: number | null
          review_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          hourly_rate?: number | null
          skills?: string[] | null
          experience_years?: number | null
          portfolio_url?: string | null
          availability_status?: string | null
          rating?: number | null
          review_count?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string | null
          title: string
          description: string
          budget_min: number | null
          budget_max: number | null
          deadline: string | null
          status: "open" | "in_progress" | "completed" | "cancelled"
          required_skills: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          title: string
          description: string
          budget_min?: number | null
          budget_max?: number | null
          deadline?: string | null
          status?: "open" | "in_progress" | "completed" | "cancelled"
          required_skills?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          title?: string
          description?: string
          budget_min?: number | null
          budget_max?: number | null
          deadline?: string | null
          status?: "open" | "in_progress" | "completed" | "cancelled"
          required_skills?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "user" | "analyst" | "admin"
      project_status: "open" | "in_progress" | "completed" | "cancelled"
      application_status: "pending" | "accepted" | "rejected"
      visibility_type: "public" | "private" | "unlisted"
      hackathon_status: "upcoming" | "active" | "ended"
      notification_type:
        | "query_fork"
        | "notebook_comment"
        | "project_application"
        | "hackathon_update"
        | "payment_received"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
