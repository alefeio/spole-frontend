# Sprint 09 — Pagamento mock de reserva de arena

## Objetivo

Implementar o pagamento mock de reserva SINGLE de arena com checkout autenticado, criação via endpoint real, polling de status, revalidação da reserva e UX mobile-first.

## Escopo

- CTA “Pagar reserva” no detalhe (`/account/reservations/[reservationId]`)
- Checkout em `/account/reservations/[reservationId]/payment`
- `POST /reservations/:reservationId/payments` com `PIX` + `mock-provider`
- Polling `GET /payments/:id` (4 s, máx. 5 min, só `PENDING`)
- Revalidação `GET /reservations/:id` e `GET /reservations/me`
- Tratamento `PAYMENT_ALREADY_EXISTS` via `GET /users/me/payments`
- `PaymentCard` / `PaymentDetail` com `reservationId`
- Header `Idempotency-Key` no POST de pagamento de reserva
- Mensagens sobre dependência de webhook no backend

## Fora de escopo

- `POST /reservation-payments/webhook` no browser
- Gateway/PIX real, aprovação manual no frontend
- Recorrência e `POST /reservation-occurrences/:occurrenceId/payments`
- Admin/CRUD arena, `/search`, edição de perfil
- Alterações em `/api`

## Endpoints usados

| Método | Rota                                    | Uso                            |
| ------ | --------------------------------------- | ------------------------------ |
| GET    | `/reservations/:id`                     | Resumo e regras no checkout    |
| GET    | `/reservations/me`                      | Revalidação após pagamento     |
| POST   | `/reservations/:reservationId/payments` | Criar pagamento mock           |
| GET    | `/payments/:id`                         | Polling de status              |
| GET    | `/users/me/payments`                    | Recuperar pagamento existente  |
| PATCH  | `/reservations/:id/cancel`              | Mantido no detalhe (Sprint 08) |

## Fluxo de pagamento de reserva

1. Usuário cria reserva SINGLE (Sprint 08).
2. Se `status === PENDING` e `financial.requiredPaymentAmount > 0`, detalhe exibe **Pagar reserva**.
3. Checkout carrega `GET /reservations/:id`, exibe resumo e `expiresAt`.
4. **Iniciar pagamento mock** → `POST` com idempotency key → guarda `payment.id`.
5. Polling `GET /payments/:id` enquanto `PENDING`.
6. Paralelamente, revalida reserva (mesmo intervalo de polling).
7. Confirmação da reserva (`CONFIRMED`) só quando a API refletir após webhook no backend.
8. Sem botão de simular webhook ou aprovar no frontend.

## Relação reserva × pagamento

| Origem   | Regra                                                                   |
| -------- | ----------------------------------------------------------------------- |
| API      | `PENDING` + percentual > 0 → pagável                                    |
| API      | `min_reservation_payment_percent = 0` → `CONFIRMED` na criação, sem CTA |
| Frontend | Não infere `CONFIRMED` por `paidAmount`                                 |
| Frontend | Status sempre de `GET /reservations/:id` e `GET /payments/:id`          |

## Polling

- Reuso `usePayment({ pollWhilePending: true })` — 4 s, máx. 5 min.
- `useReservationPaymentSync` invalida cache da reserva enquanto pagamento pendente e ao terminar.

## Idempotência

- Cada clique em “Iniciar pagamento mock” gera `crypto.randomUUID()` enviado como `Idempotency-Key`.
- Comportamento de booking inalterado (sem key obrigatória).

## PAYMENT_ALREADY_EXISTS

1. POST retorna 409 `PAYMENT_ALREADY_EXISTS`.
2. Frontend chama `GET /users/me/payments` (limit 100).
3. Filtra `reservationId` no client.
4. Se achar: link para `/account/payments/[paymentId]` e card com polling.
5. Se não achar: mensagem orientando Meus pagamentos.

## Teste em desenvolvimento (webhook manual)

O frontend **não** chama o webhook. Para confirmar pagamento em dev:

1. Criar reserva em arena com `min_reservation_payment_percent > 0` (seed: Arena Norte).
2. Iniciar pagamento mock no checkout.
3. Copiar `providerReference` exibido no pagamento.
4. No terminal (API local), disparar webhook de teste:

```bash
curl -X POST http://localhost:3000/reservation-payments/webhook \
  -H "Content-Type: application/json" \
  -H "X-Spole-Reservation-Payment-Webhook-Secret: SEU_PAYMENTS_WEBHOOK_SECRET" \
  -d '{"providerReference":"<providerReference>","status":"PAID"}'
```

5. Aguardar polling: pagamento `PAID` e reserva `CONFIRMED` na UI.

## Tratamento de erros

Códigos mapeados em `error-messages.ts`: `RESERVATION_NOT_PAYABLE`, `RESERVATION_EXPIRED`, `RESERVATION_NO_PAYMENT_REQUIRED`, `PAYMENT_ALREADY_EXISTS`, `PAYMENT_CREATE_FAILED`, `PAYMENT_STATE_CONFLICT`, `IDEMPOTENCY_*`, além dos já existentes.

## Ajustes mobile

- Checkout em coluna única; grid `lg:` no desktop.
- Botões `min-h-11`, financial em `dl`, `expiresAt` em alerta.
- UUIDs e `providerReference` com `break-all`.

## Arquivos criados/alterados

**Novos**

- `src/features/reservations/reservation-payability.ts`
- `src/features/payments/components/reservation-checkout-summary.tsx`
- `src/features/payments/components/reservation-checkout-payment-card.tsx`
- `src/app/(app)/account/reservations/[reservationId]/payment/page.tsx`
- `docs/01-sprints/sprint-09-reservation-payment-mock.md`

**Alterados**

- `src/lib/api/client.ts` — `idempotencyKey`
- `src/features/payments/api.ts`, `hooks.ts`, `types.ts`
- `src/features/payments/components/payment-card.tsx`, `payment-detail.tsx`
- `src/features/reservations/components/reservation-detail.tsx`
- `src/lib/api/error-messages.ts`

## Critérios de aceite

- [x] CTA e checkout só quando aplicável
- [x] POST real com PIX/mock-provider
- [x] Polling sem webhook no browser
- [x] Status da API; revalidação da reserva
- [x] PAYMENT_ALREADY_EXISTS sem endpoint inventado
- [x] Sem recorrência/gateway real
- [x] `pnpm lint` e `pnpm build`

## Pendências conhecidas

- Pagamento pode permanecer `PENDING` em dev sem webhook manual.
- Lista de pagamentos para recuperar existente limitada a 100 itens.
- `GET /reservations/me` sem financial completo (pagamento só pelo detalhe).

## Próximos passos

- Recorrência e pagamento de ocorrência (sprint futura).
- Documentação operacional de webhook em ambiente compartilhado.
- Opcional: filtro server-side em `GET /users/me/payments` se o backend evoluir.
