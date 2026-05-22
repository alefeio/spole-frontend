# Sprint 07 — Detalhe de pagamento, polling no checkout e evento privado

## Objetivo

Consolidar o fluxo principal do produto após as Sprints 00–06: detalhe de pagamento com `GET /payments/:id`, acompanhamento de status no checkout mock, acesso a eventos privados via `privateCode` e ajustes de UX/mobile.

## Escopo

- Rota autenticada `/account/payments/[paymentId]`
- Polling de `GET /payments/:id` no checkout após `POST /bookings/:bookingId/payments`
- Gate de `privateCode` no detalhe do evento (403)
- Links e CTAs em `/account/payments` e checkout
- Mensagens de edge case no checkout (booking fora da página carregada)
- Hardening de mensagens de erro (rede, 403, 404)
- Revisão mobile-first nas telas tocadas

## Fora de escopo

- `GET /bookings/:id` (não existe)
- `POST /payments/webhook` no browser
- Simulação de aprovação de pagamento no frontend
- Gateway real
- Pagamento de reserva de arena / recorrência / reservas de arena
- Admin avançado, `/search`, edição de perfil
- Enriquecimento de cards com N× `GET /events/:id`
- Alterações em `/api`

## Endpoints usados

| Método | Rota                                 | Uso                                          |
| ------ | ------------------------------------ | -------------------------------------------- |
| GET    | `/payments/:id`                      | Detalhe + polling no checkout                |
| GET    | `/users/me/payments`                 | Lista em `/account/payments`                 |
| POST   | `/bookings/:bookingId/payments`      | Criar pagamento mock no checkout             |
| GET    | `/users/me/bookings`                 | Localizar booking no checkout (`limit: 100`) |
| PATCH  | `/bookings/:id/cancel`               | Já existente em `/account/bookings`          |
| GET    | `/events/:id`                        | Detalhe + `privateCode` query                |
| POST   | `/events/:eventId/participants/free` | Inscrição gratuita com `privateCode`         |
| POST   | `/events/:eventId/bookings`          | Reserva paga com `privateCode`               |

## Fluxo de detalhe de pagamento

1. Usuário abre `/account/payments` e toca em **Ver detalhes**.
2. Página carrega `GET /payments/:id`.
3. Exibe status, valores, método, provedor, datas e `bookingId` quando existir.
4. Se `PENDING` e houver `bookingId`, CTA para `/checkout/[bookingId]`.
5. Polling opcional na própria página de detalhe enquanto status for `PENDING` (máx. 5 min, intervalo 4 s).

## Fluxo de polling no checkout

1. Checkout resolve booking via `GET /users/me/bookings?page=1&limit=100`.
2. Usuário cria pagamento com `POST /bookings/:bookingId/payments`.
3. Frontend guarda `payment.id` e passa a consultar `GET /payments/:id`.
4. Polling apenas enquanto `status === PENDING` (para em estados terminais: `PAID`, `FAILED`, `REFUNDED`, `CANCELLED`).
5. Copy explica dependência do webhook do backend.
6. CTAs: Ver pagamento, Meus pagamentos, Minhas inscrições.

## Fluxo de privateCode

1. Usuário abre `/events/[eventId]` sem código → API retorna 403 `FORBIDDEN`.
2. UI exibe `EventPrivateCodeGate` (input + validação).
3. Submit faz `router.replace` para `/events/[id]?privateCode=...` (sem localStorage/sessionStorage).
4. `useEvent` refaz `GET /events/:id?privateCode=...`.
5. Código inválido: gate com mensagem de erro; mesmo fluxo de URL.
6. `EventParticipationCta` repassa `privateCode` nos POST de inscrição/booking.

## Decisões técnicas

| Decisão                                  | Motivo                                                     |
| ---------------------------------------- | ---------------------------------------------------------- |
| Booking no checkout via lista paginada   | Não existe `GET /bookings/:id`                             |
| Polling 4 s, máx. 5 min                  | Evitar loop agressivo; contrato permite espera por webhook |
| `privateCode` só na URL                  | Alinhado ao contrato; sem persistência local               |
| `type="password"` no input do código     | Reduz exposição visual casual                              |
| `usePayment({ pollWhilePending })`       | Reuso entre checkout e detalhe                             |
| Status terminais do tipo `PaymentStatus` | Sem cálculo de regra de negócio no front                   |

## Tratamento de erros

- **401 / UNAUTHORIZED:** `apiClient` limpa sessão e redireciona para login (comportamento existente).
- **403 em evento:** gate de `privateCode` quando `FORBIDDEN`; outras 403 com mensagem de permissão.
- **404:** estados dedicados (evento, pagamento).
- **Failed to fetch:** mensagem de rede em `error-messages.ts`.
- **Envelope API:** `getApiErrorMessage` + mapa de `code`.

## Ajustes mobile realizados

- Cards em coluna única; botões `min-h-11` no mobile.
- `break-all` / `break-words` em IDs e textos longos.
- Grid progressivo `sm:` / `lg:` no checkout e detalhe.
- Formulário de código full-width.
- Sem tabelas nas telas alteradas.

## Arquivos criados / alterados

```
src/app/(app)/account/payments/[paymentId]/page.tsx
src/features/payments/payment-status.ts
src/features/payments/components/payment-detail.tsx
src/features/payments/components/payment-detail-skeleton.tsx
src/features/payments/components/payment-detail-error.tsx
src/features/payments/components/payment-card.tsx
src/features/payments/components/checkout-payment-card.tsx
src/features/payments/hooks.ts
src/features/payments/types.ts
src/app/(app)/checkout/[bookingId]/page.tsx
src/features/events/components/event-private-code-gate.tsx
src/features/events/components/event-details.tsx
src/features/events/components/event-details-error.tsx
src/features/events/components/event-participation-cta.tsx
src/lib/api/error-messages.ts
docs/01-sprints/sprint-07-payment-detail-private-events.md
```

## Critérios de aceite

- [x] `/account/payments/[paymentId]` usa `GET /payments/:id`
- [x] `/account/payments` linka para detalhe e continuar checkout quando aplicável
- [x] Checkout cria pagamento com `POST /bookings/:bookingId/payments`
- [x] Polling via `GET /payments/:id` apenas em `PENDING`
- [x] Sem webhook nem simulação de aprovação no browser
- [x] Evento privado sem código mostra gate; com código válido carrega detalhe
- [x] Participação repassa `privateCode` nos POST
- [x] Sem `GET /bookings/:id`; sem fetch fora de `client.ts`
- [x] Nenhum arquivo em `/api` alterado
- [x] Sem logs temporários de debug
- [x] Documentação da sprint criada

## Pendências conhecidas

- Confirmação `PAID` em dev exige webhook manual no backend.
- Checkout com mais de 100 bookings pode não achar a reserva na primeira página.
- Cards de booking/participante continuam exibindo `eventId` (API não retorna título).

## Próximos passos

1. Instruções de dev para disparar webhook de pagamento em homologação.
2. Melhorar checkout se o backend expuser `GET /bookings/:id` ou filtro por id na listagem.
3. Arena / reservas / recorrência em sprint futura.
