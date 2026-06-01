/**
 * Modo de pagamento no frontend (UI de desenvolvimento).
 * A cobrança Pix real é criada pelo backend quando `PAYMENTS_PROVIDER=asaas` no servidor.
 *
 * Contrato atual do POST (`/api/src/modules/payments/shared.ts`): o body aceita apenas
 * `provider: "mock-provider"` — o valor do campo não seleciona o gateway; o servidor usa
 * `PAYMENTS_PROVIDER` para escolher mock ou Asaas.
 */

export type PaymentsProviderMode = "mock" | "asaas";

/** Único `provider` aceito pelo body do POST na API atual. */
const API_PAYMENT_PROVIDER = "mock-provider";

export function getPaymentsProviderMode(): PaymentsProviderMode {
  const configured = process.env.NEXT_PUBLIC_PAYMENTS_PROVIDER?.trim().toLowerCase();
  if (configured === "mock") return "mock";
  return "asaas";
}

/** Exibe aviso de ambiente simulado na UI quando o front está em modo mock explícito. */
export function isMockPaymentsDevMode(): boolean {
  return getPaymentsProviderMode() === "mock";
}

export type CreatePaymentRequestBody = {
  method: "PIX";
  provider: typeof API_PAYMENT_PROVIDER;
};

/** Payload do POST de pagamento — alinhado ao contrato real da API. */
export function buildCreatePaymentPayload(): CreatePaymentRequestBody {
  return {
    method: "PIX",
    provider: API_PAYMENT_PROVIDER
  };
}
