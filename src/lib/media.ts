import type { SupabaseClient } from "@supabase/supabase-js";

const PUBLIC_MEDIA_MARKER = "/storage/v1/object/public/media/";

/**
 * Returns the object path only for files that belong to this app's public
 * `media` bucket. External URLs are deliberately ignored.
 */
export function getManagedMediaPath(url: string | null | undefined) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!configuredSupabaseUrl) return null;

    const storageOrigin = new URL(configuredSupabaseUrl).origin;
    if (parsed.origin !== storageOrigin) return null;

    const markerIndex = parsed.pathname.indexOf(PUBLIC_MEDIA_MARKER);
    if (markerIndex === -1) return null;

    const encodedPath = parsed.pathname.slice(
      markerIndex + PUBLIC_MEDIA_MARKER.length
    );

    return encodedPath ? decodeURIComponent(encodedPath) : null;
  } catch {
    return null;
  }
}

/** Best-effort cleanup: a failed cleanup must not undo an already saved row. */
export async function removeManagedMedia(
  supabase: SupabaseClient,
  urls: Array<string | null | undefined>
) {
  const managedUrls = Array.from(
    new Set(urls.filter((url): url is string => !!url && !!getManagedMediaPath(url)))
  );

  const paths: string[] = [];

  for (const url of managedUrls) {
    const checks = await Promise.all([
      supabase.from("product_images").select("id").eq("url", url).limit(1),
      supabase.from("categories").select("id").eq("image_url", url).limit(1),
      supabase.from("stores").select("id").eq("photo_url", url).limit(1),
      supabase.from("campaigns").select("id").eq("image_desktop_url", url).limit(1),
      supabase.from("campaigns").select("id").eq("image_mobile_url", url).limit(1),
      supabase.from("content_sections").select("id").contains("data", { image_url: url }).limit(1),
      supabase.from("media").select("id").eq("url", url).limit(1),
    ]);

    // A read error is treated conservatively: keep the file rather than risk
    // breaking another record that still uses the same URL.
    const stillReferenced = checks.some(
      ({ data, error }) => !!error || (data?.length ?? 0) > 0
    );

    const path = getManagedMediaPath(url);
    if (!stillReferenced && path) paths.push(path);
  }

  if (paths.length === 0) return;

  const { error } = await supabase.storage.from("media").remove(paths);
  if (error) {
    console.error("Não foi possível limpar arquivos antigos do Storage:", error.message);
  }
}
