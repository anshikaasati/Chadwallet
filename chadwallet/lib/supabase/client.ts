// lib/supabase/client.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

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
