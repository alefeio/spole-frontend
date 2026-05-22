/**
 * Chaves de idempotência e request id (UUID quando disponível).
 */
export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Alias para X-Request-Id enviado em cada requisição. */
export const createRequestId = createIdempotencyKey;
