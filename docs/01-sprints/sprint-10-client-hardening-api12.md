# Sprint 10 — Hardening do cliente (API ~12)

## Objetivo

Consolidar tratamento de erros, request id, rate limit, idempotência, polling, cache e copy de UX nas rotas de pagamento/reserva — **sem** novas funcionalidades de produto.

## Escopo

- `X-Request-Id` enviado em cada requisição; captura do header em erros (`ApiError.requestId`)
- Código de referência em erros operacionais (5xx, 429, `UNKNOWN_ERROR`, `INTERNAL_SERVER_ERROR`, etc.)
- Mensagem `RATE_LIMIT_EXCEEDED` + `Retry-After` quando presente
- `createIdempotencyKey()` centralizado
- `Idempotency-Key` em `POST /events/:eventId/bookings` e `POST /bookings/:bookingId/payments`
- Manutenção da idempotência em `POST /reservations/:reservationId/payments`
- Constantes de polling centralizadas (`4s` / `5 min` / só `PENDING`)
- Copy pós-timeout de polling nos checkouts e detalhe de pagamento
- Revalidação de cache de booking/reserva/eventos ao atingir status terminal de pagamento
- Suavização de textos técnicos (`GET /...`) em telas de usuário
- Revisão mobile leve nas rotas de pagamento/reserva/checkout
- Documentação atualizada

## Fora de escopo

- CRUD de eventos, Admin UI, painel do dono de arena
- Recorrência e pagamento de ocorrência
- Gateway real, webhook no browser, `/search`, `PATCH /users/me`
- Migração de auth para cookies
- Reescrita do `apiClient` ou do design system
- Alterações em `/api`

## Mudanças no apiClient

| Item           | Comportamento                                                    |
| -------------- | ---------------------------------------------------------------- |
| `X-Request-Id` | Header gerado por requisição (`createRequestId`)                 |
| Erros          | `ApiError` com `requestId?`, `retryAfter?` (429 + `Retry-After`) |
| 401            | Inalterado: remove token e redireciona para `/login`             |
| Envelope       | Mantido `{ success, data }` / `{ success: false, error }`        |
| Idempotency    | Header `Idempotency-Key` quando `idempotencyKey` informado       |

## Request id

- Uso interno e suporte; exibido ao usuário apenas em erros operacionais via `getApiErrorMessage`.
- **Não** exibido em validação de campo, credenciais inválidas, `EVENT_FULL`, 404 com copy específica, 409/422 de negócio já mapeados.

## Rate limit

- Código `RATE_LIMIT_EXCEEDED` com mensagem em português.
- Se `Retry-After` vier no 429: mensagem com segundos sugeridos.
- Sem fila global nem retry automático no cliente.

## Idempotência

| Rota                                         | Header                             |
| -------------------------------------------- | ---------------------------------- |
| `POST /events/:eventId/bookings`             | Sim                                |
| `POST /bookings/:bookingId/payments`         | Sim                                |
| `POST /reservations/:reservationId/payments` | Sim (Sprint 09)                    |
| `POST /reservations`                         | Não (API sem `runWithIdempotency`) |

Mensagens: `IDEMPOTENCY_IN_PROGRESS`, `IDEMPOTENCY_KEY_REUSED`.

## Polling

- `src/features/payments/polling-config.ts`: `PAYMENT_POLL_INTERVAL_MS = 4000`, `PAYMENT_POLL_MAX_MS = 5 * 60 * 1000`
- Polling apenas enquanto `status === PENDING`; para em terminal ou após timeout
- `pollTimedOut` exposto em `usePayment` para copy pós-timeout

## Cache / revalidação

- `invalidatePaymentTerminalCaches`: ao sair de `PENDING` para terminal, invalida `payments`, `bookings`/`events` ou `reservations` conforme vínculo do pagamento
- `useReservationPaymentSync` continua revalidando detalhe da reserva enquanto pendente

## Mobile regression

Rotas revisadas: checkout de booking, meus pagamentos, detalhe de pagamento, reservas, checkout de reserva, espaço/slots. Critérios: sem overflow horizontal, IDs com `break-all`, botões `min-h-11`, cards em coluna no mobile.

## Documentação atualizada

- `docs/02-features/api-contract-map.md` — fluxo de pagamento de reserva no frontend
- `docs/00-product/frontend-overview.md` — escopo até Sprint 10
- `README.md` — troubleshooting e fora de escopo

## Arquivos principais

| Arquivo                                              | Alteração                                      |
| ---------------------------------------------------- | ---------------------------------------------- |
| `src/lib/api/client.ts`                              | Request id, meta de erro                       |
| `src/lib/api/errors.ts`                              | `requestId`, `retryAfter`                      |
| `src/lib/api/error-messages.ts`                      | Rate limit, idempotência, código de referência |
| `src/lib/api/idempotency.ts`                         | **Novo**                                       |
| `src/features/payments/polling-config.ts`            | **Novo**                                       |
| `src/features/payments/invalidate-payment-caches.ts` | **Novo**                                       |
| `src/features/payments/hooks.ts`                     | Polling centralizado, terminal cache           |
| `src/features/bookings/api.ts`                       | Idempotency em booking                         |
| `src/features/payments/api.ts`                       | Idempotency em pagamento de booking            |

## Critérios de aceite

- [x] `pnpm lint` e `pnpm build` passam
- [x] Nenhum arquivo em `/api` alterado
- [x] `fetch` apenas em `src/lib/api/client.ts`
- [x] 429 / `RATE_LIMIT_EXCEEDED` em português
- [x] `X-Request-Id` enviado; `requestId` em erros operacionais quando retornado
- [x] Idempotência em booking e pagamento de booking; reserva mantida
- [x] Polling 4s / 5min / só `PENDING`
- [x] Copy pós-timeout nos fluxos de pagamento
- [x] Revalidação de reserva/booking em status terminal
- [x] Docs Sprint 10 + mapa + overview + README

## Pendências conhecidas

- Erro de rede (`Failed to fetch`) não carrega `requestId` (sem resposta HTTP).
- `Retry-After` em formato HTTP-date não é interpretado — apenas valor em segundos.
- Checkout de booking ainda resolve booking via lista paginada (até 100 itens).

## Integração CORS (obrigatório com `X-Request-Id`)

Em dev cross-origin, a API deve incluir `X-Request-Id` em `Access-Control-Allow-Headers` e em `Access-Control-Expose-Headers`. Testes via PowerShell/curl **não** simulam preflight do navegador.

O `apiClient` envia `X-Request-Id` em **POST/PATCH/DELETE** e quando há `Idempotency-Key`. **GET/HEAD** (incl. `GET /users/me` no header público) omitem o header para não disparar preflight CORS quando a API ainda não liberou `X-Request-Id` em `Allow-Headers`. Reinicie a API após atualizar o CORS em `api/src/app.ts` para alinhar com a Sprint 10 completa.

## Próximos passos

- Admin (API 11), CRUD de eventos ou gestão de arena — conforme priorização de produto.
- Recorrência e gateway real permanecem fora do escopo imediato.
