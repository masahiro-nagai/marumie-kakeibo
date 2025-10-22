export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          color: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      group_invitations: {
        Row: {
          id: string
          group_id: string
          email: string
          invited_by: string
          status: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          group_id: string
          email: string
          invited_by: string
          status?: string
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          email?: string
          invited_by?: string
          status?: string
          created_at?: string
          expires_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          group_id: string | null
          category_id: string | null
          amount: number
          description: string | null
          type: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          group_id?: string | null
          category_id?: string | null
          amount: number
          description?: string | null
          type: string
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          group_id?: string | null
          category_id?: string | null
          amount?: number
          description?: string | null
          type?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

