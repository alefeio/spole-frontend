export type ApiErrorPayload = {
  code: string;
  message: string;
  details?: unknown[];
};

export type ApiFailureEnvelope = {
  success: false;
  error: ApiErrorPayload;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown[];

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

export function isApiFailureEnvelope(value: unknown): value is ApiFailureEnvelope {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (record.success !== false) return false;
  const error = record.error;
  if (!error || typeof error !== "object") return false;
  const err = error as Record<string, unknown>;
  return typeof err.code === "string" && typeof err.message === "string";
}
