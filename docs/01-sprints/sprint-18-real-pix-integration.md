# Sprint 18 — Pagamento Pix real e integração ponta a ponta

## Objetivo

Alinhar o frontend ao núcleo de pagamento real do backend (Asaas/Pix): consumir `checkout` nos POSTs de pagamento e em `GET /payments/:id`, exibir QR e copia-e-cola, manter polling até status terminal e remover mock como experiência principal.

## Contexto do backend

- `PAYMENTS_PROVIDER=asaas` no servidor cria cobrança Pix real.
- `PAYMENTS_PROVIDER=mock` mantém checkout simulado (dev/CI).
- POSTs: `POST /bookings/:bookingId/payments`, `POST /reservations/:reservationId/payments`.
- Resposta aditiva: `providerReference`, `contextExpiresAt`, `checkout { pixCopyPaste, pixQrCode, paymentExpiresAt }`.
- `GET /payments/:id` inclui `checkout` enquanto `PENDING`.
- Webhook no servidor atualiza `PAID`, `FAILED`, `CANCELLED` — **não** no browser.

## Escopo

- Tipos e API de pagamento com `checkout` e `contextExpiresAt`.
- `buildCreatePaymentPayload()` com body `{ method: "PIX", provider: "mock-provider" }` (único valor aceito pela API); `NEXT_PUBLIC_PAYMENTS_PROVIDER` só controla aviso de dev na UI.
- Componente `PixCheckoutPanel` (QR, copiar, prazos, status PT).
- Checkout de evento (`/checkout/[bookingId]`) e reserva (`/account/reservations/.../payment`).
- Detalhe de pagamento com Pix pendente.
- Badges e mensagens em português.
- Polling e invalidação de cache (Sprint 17 preservada).
- Auditoria leve dos read models (sem reimplementação).
- Docs, `.env.example`, checklist QA.

## Fora de escopo

Alterações em `/api`, webhook no browser, refund, cartão/boleto, gateway alternativo, mapa, BI, check-in, recorrência, UI de `reservation-occurrences` payment, redesign, reescrita de apiClient, migração de auth.

## Endpoints

| Método | Rota                                    | Uso                         |
| ------ | --------------------------------------- | --------------------------- |
| POST   | `/bookings/:bookingId/payments`         | Checkout evento pago        |
| POST   | `/reservations/:reservationId/payments` | Checkout reserva arena      |
| GET    | `/payments/:id`                         | Polling + checkout pendente |

Read models das Sprints 16–17 permanecem inalterados nesta sprint.

## Integração Pix real

1. Usuário clica **Pagar com Pix**.
2. POST retorna `checkout` + `contextExpiresAt`.
3. UI exibe QR e copia-e-cola.
4. Polling em `GET /payments/:id` até terminal.
5. Mensagens: confirmado / não aprovado / cancelado.

## Fallback mock/dev

- `NEXT_PUBLIC_PAYMENTS_PROVIDER=mock` no front + `PAYMENTS_PROVIDER=mock` no backend.
- Aviso discreto na UI (“ambiente de desenvolvimento”).
- Homologação real: `NEXT_PUBLIC_PAYMENTS_PROVIDER=asaas` + `PAYMENTS_PROVIDER=asaas` no servidor.

**Contrato do body:** a API valida apenas `provider: "mock-provider"` (`payments/shared.ts`). Pix real exige `PAYMENTS_PROVIDER=asaas` no **servidor**; o front não envia `asaas` no body até a API aceitar esse valor.

## Read models auditados

Confirmado sem alteração estrutural: `GET /arenas`, `GET /users/me/arenas`, `GET /users/me/events`, `GET /events/:id`, operação por evento (summary/bookings/payments), sem `/admin/*` no organizador/dono.

## Arquivos principais

- `src/lib/payments/payment-provider.ts`
- `src/features/payments/types.ts`, `api.ts`
- `src/features/payments/components/pix-checkout-panel.tsx`
- `src/features/payments/payment-status-labels.ts`
- `src/features/payments/components/checkout-payment-card.tsx`
- `src/features/payments/components/reservation-checkout-payment-card.tsx`
- `src/features/payments/components/payment-detail.tsx`
- `src/features/payments/components/payment-status-badge.tsx`
- `src/app/(app)/checkout/[bookingId]/page.tsx`
- `src/app/(app)/account/reservations/[reservationId]/payment/page.tsx`
- `src/features/bookings/components/booking-hold-confirmation.tsx`
- `src/lib/api/error-messages.ts`
- `.env.example`
- `docs/03-qa/mvp-operational-checklist.md`

## Critérios de aceite

- [x] Checkout Pix real na UI principal (sem “mock” como título principal).
- [x] `checkout` e polling em `GET /payments/:id`.
- [x] Status terminal PAID/FAILED/CANCELLED em português.
- [x] `pnpm lint` e `pnpm build` passam.
- [x] Nenhum arquivo em `/api` alterado.

## Riscos

- Body `provider: "asaas"` vs validação atual da API.
- QR base64 grande em mobile.
- Homologação Asaas depende de envs no backend.

## Próximos passos

1. Alinhar `payments/shared.ts` no backend para aceitar `asaas` no body, se necessário.
2. Cenários E2E automatizados de pagamento (opcional).
3. Próxima sprint grande da API (fora deste escopo).
