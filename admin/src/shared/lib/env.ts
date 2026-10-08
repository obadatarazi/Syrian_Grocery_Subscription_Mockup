function normalizeApiUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Reads typed environment variables for the admin application.
 * Backend integration will use these flags without changing feature code.
 */
export const env = {
  apiUrl: normalizeApiUrl(import.meta.env.VITE_API_URL ?? "/api"),
  useMocks: import.meta.env.VITE_USE_MOCKS === "true",
  storefrontUrl: (import.meta.env.VITE_STOREFRONT_URL ?? "https://haseri.sy").replace(
    /\/+$/,
    "",
  ),
} as const;
