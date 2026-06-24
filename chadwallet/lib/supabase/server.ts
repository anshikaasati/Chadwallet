// lib/supabase/server.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey } from "@/lib/config";

import { NEXT_PUBLIC_SUPABASE_URL } from "@/constants";

const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;

export function createServerClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
