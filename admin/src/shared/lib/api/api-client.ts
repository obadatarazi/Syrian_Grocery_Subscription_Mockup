import { getAuthSessionRecoveryHandlers } from "@/shared/lib/api/auth-session-recovery-bridge";
import { ServiceError } from "@/shared/errors";
import { readAccessToken } from "@/shared/lib/api/token";
import { env } from "@/shared/lib/env";

import { buildQueryString, mapLaravelError } from "./laravel.utils";

export type ApiLocale = "en" | "ar";

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown | FormData;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  token?: string | null;
  /** Active UI locale (`en` | `ar`). Defaults to `aroma-language` in localStorage. */
  locale?: ApiLocale | string;
  skipAuth?: boolean;
  /**
   * Skip mid-session 401 refresh/logout handling (login, refresh-token, etc.).
   * Prefer `skipAuth` for public endpoints; use this when a Bearer token is still sent.
   */
  skipSessionRecovery?: boolean;
  /** Internal: marks a single retry after a successful token refresh. */
  authRetry?: boolean;
  /**
   * Internal: one-shot adopt of a newer access token written by another tab
   * after an authRetry 401 (no second refresh).
   */
  authRetryAdopted?: boolean;
  /** Optional abort signal for cancelling in-flight fetches. */
  signal?: AbortSignal;
  /** Per-request override for the default client timeout (ms). Use `0` to disable. */
  timeoutMs?: number;
};

const REFRESH_TOKEN_PATH = "/admin/auth/refresh-token";
/** Default abort timeout so hung requests do not leave UI spinners forever. */
export const DEFAULT_API_REQUEST_TIMEOUT_MS = 45_000;

function resolveLocale(locale?: string): ApiLocale {
  if (locale === "ar" || locale === "en") return locale;
  try {
    const stored = localStorage.getItem("aroma-language");
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    // localStorage may be unavailable (SSR / privacy mode)
  }
  return "en";
}

function resolveToken(options: ApiRequestOptions): string | null {
  if (options.skipAuth) return null;
  // After a successful refresh, always use the latest token from storage.
  // Ignore any stale explicit `token` captured on the original request.
  if (options.authRetry) return readAccessToken();
  if (options.token !== undefined) return options.token;
  return readAccessToken();
}

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "AbortError") return true;
  if (error instanceof Error && error.name === "AbortError") return true;
  return false;
}

function isTimeoutAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "TimeoutError") return true;
  if (error instanceof Error && error.name === "TimeoutError") return true;
  return false;
}

/**
 * Combines the caller signal with an optional timeout. Prefer AbortSignal.any /
 * AbortSignal.timeout when available; fall back to a linked AbortController.
 */
function composeRequestSignal(
  callerSignal: AbortSignal | undefined,
  timeoutMs: number,
): { signal?: AbortSignal; cleanup: () => void } {
  if (timeoutMs <= 0) {
    return { signal: callerSignal, cleanup: () => undefined };
  }

  const timeoutSignal =
    typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
      ? AbortSignal.timeout(timeoutMs)
      : undefined;

  if (timeoutSignal && typeof AbortSignal.any === "function") {
    const signals = callerSignal ? [callerSignal, timeoutSignal] : [timeoutSignal];
    return { signal: AbortSignal.any(signals), cleanup: () => undefined };
  }

  const controller = new AbortController();
  const onCallerAbort = () => {
    controller.abort(callerSignal?.reason);
  };
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (callerSignal) {
    if (callerSignal.aborted) {
      controller.abort(callerSignal.reason);
    } else {
      callerSignal.addEventListener("abort", onCallerAbort, { once: true });
    }
  }

  if (timeoutSignal) {
    const onTimeoutAbort = () => controller.abort(timeoutSignal.reason);
    if (timeoutSignal.aborted) {
      controller.abort(timeoutSignal.reason);
    } else {
      timeoutSignal.addEventListener("abort", onTimeoutAbort, { once: true });
    }
    return {
      signal: controller.signal,
      cleanup: () => {
        callerSignal?.removeEventListener("abort", onCallerAbort);
        timeoutSignal.removeEventListener("abort", onTimeoutAbort);
      },
    };
  }

  timeoutId = setTimeout(() => {
    controller.abort(new DOMException("TimeoutError", "TimeoutError"));
  }, timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      callerSignal?.removeEventListener("abort", onCallerAbort);
    },
  };
}

function shouldAttemptSessionRecovery(path: string, options: ApiRequestOptions): boolean {
  if (options.skipAuth) return false;
  if (options.skipSessionRecovery) return false;
  if (options.authRetry) return false;
  if (path === REFRESH_TOKEN_PATH || path.endsWith(REFRESH_TOKEN_PATH)) return false;
  // No stored session → nothing to refresh/logout for.
  if (!readAccessToken()) return false;
  return getAuthSessionRecoveryHandlers() != null;
}

function isAuthSupersededError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { name?: string; code?: string };
  return candidate.name === "AuthSupersededError" || candidate.code === "auth_superseded";
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    headers = {},
    locale,
    skipAuth,
    signal: callerSignal,
    timeoutMs = DEFAULT_API_REQUEST_TIMEOUT_MS,
  } = options;
  const token = resolveToken({ ...options, skipAuth });
  const { signal, cleanup } = composeRequestSignal(callerSignal, timeoutMs);

  // X-Locale is set last so callers cannot override the active ar/en locale.
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    "X-Locale": resolveLocale(locale),
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let requestBody: BodyInit | undefined;
  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const url = `${env.apiUrl}${path}${buildQueryString(params)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal,
    });
  } catch (error) {
    cleanup();
    if (callerSignal?.aborted || isAbortError(error)) {
      throw error instanceof Error ? error : new DOMException("Aborted", "AbortError");
    }
    if (isTimeoutAbortError(error) || signal?.aborted) {
      throw new ServiceError("network_error");
    }
    throw new ServiceError("network_error");
  }
  cleanup();

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401 && shouldAttemptSessionRecovery(path, options)) {
      const recovery = getAuthSessionRecoveryHandlers();
      if (recovery) {
        const accessTokenBeforeRefresh = readAccessToken();
        try {
          await recovery.refreshSession();
          return apiRequest<T>(path, { ...options, authRetry: true });
        } catch (error) {
          // Another tab may have rotated tokens into storage while this refresh failed.
          const accessTokenAfter = readAccessToken();
          if (accessTokenAfter && accessTokenAfter !== accessTokenBeforeRefresh) {
            return apiRequest<T>(path, { ...options, authRetry: true });
          }

          // Superseded (logout / generation bump / intentional teardown) — never endSession.
          if (isAuthSupersededError(error)) {
            throw new ServiceError("session_expired");
          }

          // Still have the same pre-refresh token → real auth failure.
          // Empty storage (manual logout) → endSession is a no-op (no toast).
          recovery.endSession();
          throw new ServiceError("session_expired");
        }
      }
    }

    // Refresh already ran; retried request still 401 → session is invalid.
    // Do not refresh again (authRetry blocks shouldAttemptSessionRecovery).
    if (
      response.status === 401 &&
      options.authRetry &&
      !options.skipAuth &&
      !options.skipSessionRecovery
    ) {
      const latestToken = readAccessToken();
      // Another tab wrote a newer access token while this retry was in flight —
      // adopt it once without a second refresh; do not destroy that session.
      if (
        !options.authRetryAdopted &&
        latestToken &&
        token &&
        latestToken !== token
      ) {
        return apiRequest<T>(path, {
          ...options,
          authRetry: true,
          authRetryAdopted: true,
        });
      }

      // Only end the session that this attempt actually used. If storage already
      // moved to a different token (or we just adopted another tab's login), do
      // not clear/broadcast — that session belongs to a newer identity.
      const sessionStillOwnedByThisAttempt =
        Boolean(token) && latestToken === token && !options.authRetryAdopted;

      if (sessionStillOwnedByThisAttempt) {
        getAuthSessionRecoveryHandlers()?.endSession();
      }

      throw new ServiceError("session_expired");
    }

    throw mapLaravelError(response.status, payload);
  }

  return payload as T;
}
