/**
 * Armazenamento do JWT no client. Não acessar localStorage fora deste módulo.
 */

const TOKEN_KEY = "spole_access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return Boolean(getToken());
}

/** @deprecated Use getToken */
export const getAccessToken = getToken;

/** @deprecated Use setToken */
export const setAccessToken = setToken;

/** @deprecated Use removeToken */
export const clearAccessToken = removeToken;
