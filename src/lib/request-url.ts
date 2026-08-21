import { headers } from "next/headers";

/** Returns the current trusted origin, with the configured site URL as fallback. */
export function getRequestBaseUrl() {
  const origin = headers().get("origin");

  if (origin) {
    try {
      const parsed = new URL(origin);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return parsed.origin;
      }
    } catch {
      // Fall through to the configured public URL.
    }
  }

  return (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
}
