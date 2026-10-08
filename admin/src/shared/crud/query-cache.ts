type QueryCacheEntry<T> = {
  data: T;
  updatedAt: number;
};

const queryCache = new Map<string, QueryCacheEntry<unknown>>();

export const DEFAULT_QUERY_STALE_TIME_MS = 5 * 60 * 1000;

export function getQueryCacheKey(queryKey: readonly string[]): string {
  return queryKey.join(":");
}

export function getCachedQueryData<T>(queryKey: readonly string[]): T | undefined {
  const entry = queryCache.get(getQueryCacheKey(queryKey));
  return entry?.data as T | undefined;
}

export function setCachedQueryData<T>(queryKey: readonly string[], data: T): void {
  queryCache.set(getQueryCacheKey(queryKey), {
    data,
    updatedAt: Date.now(),
  });
}

export function isQueryCacheStale(
  queryKey: readonly string[],
  staleTime = DEFAULT_QUERY_STALE_TIME_MS,
): boolean {
  const entry = queryCache.get(getQueryCacheKey(queryKey));
  if (!entry) return true;
  return Date.now() - entry.updatedAt > staleTime;
}

export function invalidateQueryCache(queryKeyPrefix?: string): void {
  if (!queryKeyPrefix) {
    queryCache.clear();
    return;
  }

  const prefix = `${queryKeyPrefix}:`;
  for (const key of queryCache.keys()) {
    if (key === queryKeyPrefix || key.startsWith(prefix)) {
      queryCache.delete(key);
    }
  }
}

export function patchCachedQueryData<T>(
  queryKey: readonly string[],
  updater: (previous: T) => T,
): void {
  const current = getCachedQueryData<T>(queryKey);
  if (current === undefined) return;
  setCachedQueryData(queryKey, updater(current));
}
