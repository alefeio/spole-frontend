import { getToken, removeToken } from "@/lib/auth/token";
import { ApiError, isApiFailureEnvelope, type ApiFailureEnvelope } from "@/lib/api/errors";

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
  /**
   * undefined — anexa token do storage quando existir
   * null — nunca anexa (login/register)
   * string — usa o token informado
   */
  token?: string | null;
  signal?: AbortSignal;
};

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

/**
 * Cliente HTTP centralizado. Único lugar do app autorizado a usar fetch para a API Spolê.
 */
export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<ApiSuccessEnvelope<T>> {
  const { method = "GET", body, query, headers, token, signal } = options;

  const resolvedToken = token === undefined ? getToken() : token;
  const usedToken = resolvedToken ?? null;

  const requestHeaders = new Headers(headers);
  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
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
      throw new ApiError(response.status, json.error);
    }

    const fallback: ApiFailureEnvelope = {
      success: false,
      error: {
        code: response.status === 401 ? "UNAUTHORIZED" : "UNKNOWN_ERROR",
        message: response.statusText || "Request failed"
      }
    };
    throw new ApiError(response.status, fallback.error);
  }

  if (!json || typeof json !== "object" || (json as ApiSuccessEnvelope<T>).success !== true) {
    throw new ApiError(500, {
      code: "INVALID_RESPONSE",
      message: "API response envelope is invalid"
    });
  }

  return json as ApiSuccessEnvelope<T>;
}

export { getApiBaseUrl };
