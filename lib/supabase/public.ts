import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

export function createSupabasePublicClient() {
  const { url, publishableKey } = getSupabaseConfig();
  return createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
