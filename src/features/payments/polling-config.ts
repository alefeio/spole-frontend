export const PAYMENT_POLL_INTERVAL_MS = 4000;

export const PAYMENT_POLL_MAX_MS = 5 * 60 * 1000;

export const PAYMENT_POLL_TIMEOUT_MESSAGE =
  "A confirmação ainda não chegou. Verifique se o Pix foi pago no app do banco e consulte esta página ou Meus pagamentos em alguns minutos.";

export const PAYMENT_POLL_TIMEOUT_MESSAGE_DEV =
  "A confirmação ainda não chegou. Em ambiente simulado, dispare o webhook de teste no servidor ou consulte Meus pagamentos mais tarde.";
