import { ApiError } from "@/lib/api/errors";

const CODE_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: "Verifique os dados informados.",
  INVALID_CREDENTIALS: "E-mail ou senha incorretos.",
  EMAIL_ALREADY_EXISTS: "Este e-mail já está cadastrado.",
  USER_SUSPENDED: "Sua conta está suspensa. Entre em contato com o suporte.",
  UNAUTHORIZED: "Sessão expirada. Faça login novamente.",
  FORBIDDEN: "Você não tem permissão para esta ação.",
  EVENT_FULL: "Este evento está lotado.",
  EVENT_NOT_FOUND: "Evento não encontrado.",
  EVENT_NOT_OPEN_FOR_JOIN: "Este evento não está aberto para inscrição.",
  EVENT_NOT_OPEN_FOR_BOOKING: "Este evento não está aberto para reserva de vaga.",
  EVENT_NOT_FREE: "Este evento não aceita inscrição gratuita.",
  EVENT_NOT_PAID: "Este evento não usa reserva paga.",
  ALREADY_REGISTERED: "Você já está inscrito neste evento.",
  BOOKING_CONFLICT: "Você já possui uma reserva ativa para este evento.",
  BOOKING_CREATE_FAILED: "Não foi possível criar a reserva da vaga.",
  BOOKING_NOT_FOUND: "Reserva não encontrada.",
  BOOKING_NOT_PAYABLE: "Esta reserva não está aberta para pagamento.",
  BOOKING_EXPIRED: "Esta reserva expirou.",
  BOOKING_NOT_CANCELLABLE: "Esta reserva não pode ser cancelada.",
  PAYMENT_NOT_FOUND: "Pagamento não encontrado.",
  PAYMENT_ALREADY_EXISTS: "Já existe um pagamento para esta reserva.",
  PAYMENT_CREATE_FAILED: "Não foi possível criar o pagamento.",
  INVALID_PAYMENT_METHOD: "Método de pagamento não suportado.",
  INVALID_PAYMENT_PROVIDER: "Provedor de pagamento não suportado.",
  NOTIFICATION_NOT_FOUND: "Notificação não encontrada.",
  REDIS_UNAVAILABLE: "Não foi possível criar a reserva temporária. Tente novamente em instantes.",
  UNKNOWN_ERROR: "Não foi possível concluir a operação.",
  INVALID_RESPONSE: "Resposta inválida do servidor.",
  INTERNAL_SERVER_ERROR: "Erro interno do servidor. Tente novamente mais tarde.",
  PAYMENT_CANNOT_COMPLETE: "Não foi possível concluir este pagamento.",
  SLOT_NOT_FOUND: "Horário não encontrado ou já indisponível.",
  SLOT_UNAVAILABLE: "Este horário não está mais disponível. Escolha outro.",
  RECURRENCE_NOT_ALLOWED: "Recorrência não está disponível nesta arena.",
  MIN_ADVANCE_VIOLATION: "Este horário exige mais antecedência do que a política da arena permite.",
  RESERVATION_CONFLICT: "Você já possui uma reserva ativa para este horário ou espaço.",
  INVALID_SLOT_PRICE: "Não foi possível reservar: preço do horário inválido.",
  RESERVATION_NOT_FOUND: "Reserva não encontrada.",
  RESERVATION_ALREADY_CONSUMED: "Esta reserva já foi utilizada e não pode ser cancelada.",
  ARENA_NOT_FOUND: "Arena não encontrada.",
  SPACE_NOT_FOUND: "Espaço não encontrado."
};

const NETWORK_ERROR_MESSAGE =
  "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

export function isPrivateEventForbidden(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403 && error.code === "FORBIDDEN";
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 401 || error.code === "UNAUTHORIZED");
}

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
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return NETWORK_ERROR_MESSAGE;
  }
  if (error instanceof Error && error.message === "Failed to fetch") {
    return NETWORK_ERROR_MESSAGE;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
