import { createRequestId } from "@/lib/api/idempotency";
import { getToken, removeToken } from "@/lib/auth/token";
import {
  ApiError,
  isApiFailureEnvelope,
  type ApiErrorPayload,
  type ApiFailureEnvelope
} from "@/lib/api/errors";

export type ApiSuccessEnvelope<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiClientOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: HeadersInit;
  /** Enviado como header Idempotency-Key em POST/PATCH quando informado. */
  idempotencyKey?: string;
  /**
   * undefined — anexa token do storage quando existir
   * null — nunca anexa (login/register)
   * string — usa o token informado
   */
  token?: string | null;
  signal?: AbortSignal;
};

const REQUEST_ID_HEADER = "x-request-id";

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  return base.replace(/\/$/, "");
}

function buildUrl(path: string, query?: ApiClientOptions["query"]): string {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, `${getApiBaseUrl()}/`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  if (pathname === "/login" || pathname === "/register") return;
  const redirect = encodeURIComponent(`${pathname}${search}`);
  window.location.href = `/login?redirect=${redirect}`;
}

function handleUnauthorized(usedToken: string | null): void {
  if (!usedToken) return;
  removeToken();
  redirectToLogin();
}

function parseRetryAfterSeconds(header: string | null): number | undefined {
  if (!header) return undefined;
  const parsed = Number.parseInt(header.trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
}

function readResponseMeta(response: Response): { requestId?: string; retryAfter?: number } {
  const requestId = response.headers.get(REQUEST_ID_HEADER)?.trim() || undefined;
  const retryAfter =
    response.status === 429
      ? parseRetryAfterSeconds(response.headers.get("Retry-After"))
      : undefined;
  return { requestId, retryAfter };
}

function throwApiError(
  response: Response,
  payload: ApiErrorPayload,
  meta?: { requestId?: string; retryAfter?: number }
): never {
  const fromHeaders = readResponseMeta(response);
  throw new ApiError(response.status, payload, {
    requestId: meta?.requestId ?? fromHeaders.requestId,
    retryAfter: meta?.retryAfter ?? fromHeaders.retryAfter
  });
}

function fallbackErrorCode(status: number): string {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 429) return "RATE_LIMIT_EXCEEDED";
  return "UNKNOWN_ERROR";
}

/**
 * X-Request-Id só em mutações (POST/PATCH/DELETE) ou quando há Idempotency-Key.
 * GET/HEAD — inclusive GET /users/me com Bearer — não enviam o header para evitar
 * preflight CORS bloqueado quando a API ainda não lista X-Request-Id em Allow-Headers.
 * A API continua gerando request id na resposta.
 */
function shouldAttachRequestId(method: string, idempotencyKey: string | undefined): boolean {
  if (idempotencyKey) return true;
  return method !== "GET" && method !== "HEAD";
}

/**
 * Cliente HTTP centralizado. Único lugar do app autorizado a usar fetch para a API Spolê.
 */
export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<ApiSuccessEnvelope<T>> {
  const { method = "GET", body, query, headers, token, signal, idempotencyKey } = options;

  const resolvedToken = token === undefined ? getToken() : token;
  const usedToken = resolvedToken ?? null;

  const requestHeaders = new Headers(headers);
  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (shouldAttachRequestId(method, idempotencyKey) && !requestHeaders.has(REQUEST_ID_HEADER)) {
    requestHeaders.set(REQUEST_ID_HEADER, createRequestId());
  }
  if (idempotencyKey) {
    requestHeaders.set("Idempotency-Key", idempotencyKey);
  }
  if (usedToken) {
    requestHeaders.set("Authorization", `Bearer ${usedToken}`);
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal
  });

  const json: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized(usedToken);
    }

    if (isApiFailureEnvelope(json)) {
      throwApiError(response, json.error);
    }

    const fallback: ApiFailureEnvelope = {
      success: false,
      error: {
        code: fallbackErrorCode(response.status),
        message: response.statusText || "Request failed"
      }
    };
    throwApiError(response, fallback.error);
  }

  if (!json || typeof json !== "object" || (json as ApiSuccessEnvelope<T>).success !== true) {
    throwApiError(response, {
      code: "INVALID_RESPONSE",
      message: "API response envelope is invalid"
    });
  }

  return json as ApiSuccessEnvelope<T>;
}

export { getApiBaseUrl };
