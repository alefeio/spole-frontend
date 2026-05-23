import { z } from "zod";

export const adminReasonSchema = z
  .string()
  .trim()
  .min(1, "Informe um motivo")
  .max(500, "O motivo deve ter no máximo 500 caracteres");

export function parseAdminReason(
  value: string
): { ok: true; reason: string } | { ok: false; message: string } {
  const parsed = adminReasonSchema.safeParse(value);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Motivo inválido" };
  }
  return { ok: true, reason: parsed.data };
}
