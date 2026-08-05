import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Uses the service-role key — only ever import this from server code that
 * has already verified the caller is a "proprietario" (see
 * src/app/admin/usuarios/actions.ts). Never expose this client, or the
 * service-role key, to the browser.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
