import type { Translation } from "@/shared/design-system/localization/locales/en";
import { SERVICE_ERROR_MESSAGE_KEYS } from "@/shared/errors/error.messages";
import { isServiceError } from "@/shared/errors/error.utils";

const GENERIC_FALLBACK_MESSAGES = new Set([
  "Request failed",
  "Mutation failed",
  "Unknown error",
]);

/**
 * Resolves a user-facing error message from API/service errors and i18n fallbacks.
 */
export function resolveServiceErrorMessage(error: unknown, t: Translation): string {
  if (isServiceError(error)) {
    if (error.message !== error.code) {
      return error.message;
    }

    const messageKey = SERVICE_ERROR_MESSAGE_KEYS[error.code];
    const translated = t[messageKey as keyof Translation];
    if (typeof translated === "string") {
      return translated;
    }

    return t.errorStateDefaultDescription;
  }

  if (error instanceof Error) {
    const message = error.message.trim();
    if (message && !GENERIC_FALLBACK_MESSAGES.has(message)) {
      return message;
    }
  }

  return t.errorStateDefaultDescription;
}
