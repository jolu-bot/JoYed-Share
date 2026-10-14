import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jtifuhxkdadztdiicvlf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Valeurs par défaut pour Supabase
const defaultSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aWZ1aHhrZGFkenRkaWljdmxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMTAxNDcsImV4cCI6MjA2MjY4NjE0N30.aPTuzMUEXUlZG8zfLpFcFO9O0-AwDMtF_5F7YOIflT8';

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey || defaultSupabaseAnonKey, 
  {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  global: {
    headers: {
      'X-Client-Info': 'jobshare-app@1.0.0'
    }
  }
});

// Client pour les opérations administratives (côté serveur uniquement)
export const supabaseAdmin = createClient(
  supabaseUrl || defaultSupabaseUrl,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aWZ1aHhrZGFkenRkaWljdmxmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzExMDE0NywiZXhwIjoyMDYyNjg2MTQ3fQ.n8wPqZ1xKmsHSxfSQfdVML3Trw6Nq9KVt7xx5dhxldw',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'user' | 'admin' | 'super_admin';
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'user' | 'admin' | 'super_admin';
          avatar_url?: string;
        };
        Update: {
          name?: string;
          email?: string;
          role?: 'user' | 'admin' | 'super_admin';
          avatar_url?: string;
        };
      };
      files: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          storage_path: string;
          mime_type?: string;
          size_bytes?: number;
          is_folder: boolean;
          parent_folder_id?: string;
          metadata?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          name: string;
          storage_path: string;
          mime_type?: string;
          size_bytes?: number;
          is_folder: boolean;
          parent_folder_id?: string;
          metadata?: any;
        };
        Update: {
          name?: string;
          storage_path?: string;
          mime_type?: string;
          size_bytes?: number;
          parent_folder_id?: string;
          metadata?: any;
        };
      };
      shared_links: {
        Row: {
          id: string;
          file_id: string;
          created_by_user_id: string;
          access_token: string;
          password_hash?: string;
          expires_at?: string;
          permissions: any;
          download_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          file_id: string;
          created_by_user_id: string;
          access_token: string;
          password_hash?: string;
          expires_at?: string;
          permissions?: any;
        };
        Update: {
          password_hash?: string;
          expires_at?: string;
          permissions?: any;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          resource_type?: string;
          resource_id?: string;
          details?: any;
          created_at: string;
        };
        Insert: {
          user_id: string;
          action: string;
          resource_type?: string;
          resource_id?: string;
          details?: any;
        };
        Update: {
          details?: any;
        };
      };
    };
  };
};

// Helper pour vérifier la connexion
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('⚠️ Connexion Supabase limitée:', error.message);
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie');
    return true;
  } catch (error) {
    console.warn('⚠️ Connexion Supabase limitée:', error);
    return false;
  }
};