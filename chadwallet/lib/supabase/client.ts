// lib/supabase/client.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from "@/constants";

const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

let clientInstance: SupabaseClient | null = null;

export function createBrowserClient(): SupabaseClient {
  if (typeof window === "undefined") {
    // Return a new client for server-side if needed, but browser client should mainly run client-side
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return clientInstance;
}
