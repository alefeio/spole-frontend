import { ApiError } from "@/lib/api/errors";

const CODE_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: "Verifique os dados informados.",
  INVALID_CREDENTIALS: "E-mail ou senha incorretos.",
  EMAIL_ALREADY_EXISTS: "Este e-mail já está cadastrado.",
  USER_SUSPENDED: "Sua conta está suspensa. Entre em contato com o suporte.",
  UNAUTHORIZED: "Sessão expirada. Faça login novamente.",
  FORBIDDEN: "Você não tem permissão para esta ação.",
  UNKNOWN_ERROR: "Não foi possível concluir a operação.",
  INVALID_RESPONSE: "Resposta inválida do servidor.",
  INTERNAL_SERVER_ERROR: "Erro interno do servidor. Tente novamente mais tarde."
};

function formatValidationDetails(details: unknown[] | undefined): string | null {
  if (!details?.length) return null;
  const first = details[0];
  if (first && typeof first === "object" && "message" in first) {
    const message = (first as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return null;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro inesperado. Tente novamente."
): string {
  if (error instanceof ApiError) {
    const validationMessage = formatValidationDetails(error.details);
    if (validationMessage) return validationMessage;
    return CODE_MESSAGES[error.code] ?? error.message ?? fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
