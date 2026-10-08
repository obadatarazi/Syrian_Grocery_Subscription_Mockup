import { env } from "@/shared/lib/env";

/** Origin for Laravel public storage (`/storage/...`). */
export function getMediaBaseUrl(): string {
  const mediaBase = import.meta.env.VITE_MEDIA_BASE_URL?.replace(/\/+$/, "");
  if (mediaBase) return mediaBase;

  return env.apiUrl.replace(/\/api\/?$/, "");
}

/**
 * Normalize a Laravel media path or URL to an absolute URL on the API origin.
 * Example: `/storage/uploads/sliders/...` → `https://api.aromacarekw.cloud/storage/...`
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }

  const mediaBase = getMediaBaseUrl();

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      if (parsed.pathname.startsWith("/storage/")) {
        return `${mediaBase}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
      return url;
    } catch {
      return url;
    }
  }

  return `${mediaBase}${url.startsWith("/") ? url : `/${url}`}`;
}
