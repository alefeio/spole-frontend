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
  PAYMENT_ALREADY_EXISTS:
    "Já existe um pagamento para esta reserva de arena. Consulte Meus pagamentos ou continue pelo link abaixo.",
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
  RESERVATION_NOT_PAYABLE: "Esta reserva de arena não está aberta para pagamento.",
  RESERVATION_EXPIRED: "Esta reserva de arena expirou. Faça uma nova reserva de horário.",
  RESERVATION_NO_PAYMENT_REQUIRED: "Esta reserva não exige pagamento.",
  PAYMENT_STATE_CONFLICT: "O pagamento não pode ser confirmado no estado atual.",
  RATE_LIMIT_EXCEEDED: "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.",
  IDEMPOTENCY_KEY_REUSED: "Essa tentativa já foi processada. Atualize a página ou tente novamente.",
  IDEMPOTENCY_IN_PROGRESS: "Essa ação já está em processamento. Aguarde alguns instantes.",
  RESERVATION_ALREADY_CONSUMED: "Esta reserva já foi utilizada e não pode ser cancelada.",
  ARENA_NOT_FOUND: "Arena não encontrada.",
  SPACE_NOT_FOUND: "Espaço não encontrado.",
  INVALID_CATEGORY: "Categoria inválida ou não encontrada.",
  INACTIVE_CATEGORY: "Esta categoria não está ativa.",
  INVALID_PRICE: "Preço inválido para o tipo de evento.",
  INVALID_DATE_RANGE: "A data de término deve ser posterior ao início.",
  INVALID_CAPACITY: "Capacidade deve ser maior que zero.",
  RESERVATION_INVALID_STATE: "Esta reserva precisa estar confirmada para gerar um evento.",
  SLOT_INVALID_STATE: "O horário da reserva não está disponível para criar evento.",
  ARENA_ADDRESS_MISSING: "A arena não possui endereço completo para vincular ao evento.",
  EVENT_CREATE_FAILED: "Não foi possível criar o evento. Tente novamente.",
  EVENT_CANCELLED: "Este evento está cancelado e não pode ser editado.",
  INVALID_STATUS: "Status de evento inválido para esta operação.",
  ADMIN_CANNOT_MODIFY_SELF: "Você não pode alterar o status da sua própria conta.",
  INVALID_STATUS_TRANSITION: "Transição de status não permitida.",
  USER_NOT_FOUND: "Usuário não encontrado.",
  INVALID_EVENT_STATUS: "Apenas cancelamento de evento é suportado nesta ação."
};

const NETWORK_ERROR_MESSAGE =
  "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

const OPERATIONAL_CODES = new Set([
  "UNKNOWN_ERROR",
  "INVALID_RESPONSE",
  "INTERNAL_SERVER_ERROR",
  "RATE_LIMIT_EXCEEDED"
]);

function formatValidationDetails(details: unknown[] | undefined): string | null {
  if (!details?.length) return null;
  const first = details[0];
  if (first && typeof first === "object" && "message" in first) {
    const message = (first as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return null;
}

function shouldAppendRequestReference(error: ApiError): boolean {
  if (!error.requestId?.trim()) return false;
  if (error.code === "VALIDATION_ERROR" && formatValidationDetails(error.details)) return false;
  if (error.code === "INVALID_CREDENTIALS") return false;
  if (error.code === "EVENT_FULL") return false;
  if (error.status === 404) return false;
  if (error.status === 409 || error.status === 422) {
    if (CODE_MESSAGES[error.code]) return false;
  }
  if (OPERATIONAL_CODES.has(error.code) || error.status >= 500) return true;
  return false;
}

function appendRequestReference(message: string, requestId: string): string {
  return `${message} Código de referência: ${requestId}.`;
}

function resolveRateLimitMessage(error: ApiError): string {
  const base = CODE_MESSAGES.RATE_LIMIT_EXCEEDED;
  if (error.retryAfter != null && error.retryAfter > 0) {
    return `Aguarde cerca de ${error.retryAfter} segundos e tente novamente.`;
  }
  return base;
}

export function isPrivateEventForbidden(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403 && error.code === "FORBIDDEN";
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 401 || error.code === "UNAUTHORIZED");
}

export function isPaymentAlreadyExistsError(error: unknown): boolean {
  return error instanceof ApiError && error.code === "PAYMENT_ALREADY_EXISTS";
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro inesperado. Tente novamente."
): string {
  if (error instanceof ApiError) {
    const validationMessage = formatValidationDetails(error.details);
    if (validationMessage) return validationMessage;

    let message: string;
    if (error.code === "RATE_LIMIT_EXCEEDED") {
      message = resolveRateLimitMessage(error);
    } else {
      message = CODE_MESSAGES[error.code] ?? error.message ?? fallback;
    }

    if (shouldAppendRequestReference(error)) {
      return appendRequestReference(message, error.requestId!);
    }

    return message;
  }

  if (
    (error instanceof TypeError || error instanceof Error) &&
    error.message === "Failed to fetch"
  ) {
    return NETWORK_ERROR_MESSAGE;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
