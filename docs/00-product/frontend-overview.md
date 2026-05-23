# Spolê — Visão do Frontend

## 1. Papel do `/web`

Cliente web do Spolê, consumindo a API REST em `/api`. O frontend é **feature-based**, com camada única de acesso à API e estado de servidor via TanStack Query.

## 2. Stack

| Camada        | Tecnologia                                      |
| ------------- | ----------------------------------------------- |
| Framework     | Next.js (App Router)                            |
| Linguagem     | TypeScript                                      |
| Estilo        | Tailwind CSS v4 + shadcn/ui                     |
| Dados remotos | TanStack Query                                  |
| API           | Cliente centralizado em `src/lib/api/client.ts` |

## 3. Princípios de arquitetura

1. **Features primeiro** — `src/features/<domínio>/` com componentes, hooks e tipos locais.
2. **API isolada** — `src/lib/api/` com client, erros e mensagens; **proibido** `fetch` fora de `client.ts`.
3. **Contrato explícito** — tipos e endpoints alinhados a [`../02-features/api-contract-map.md`](../02-features/api-contract-map.md).
4. **Sprints defasadas** — o frontend costuma implementar a sprint **N−1** em relação ao backend; Sprint 10 alinhou hardening à maturidade da API (~12).
5. **Sem antecipar backend** — não construir telas para rotas inexistentes.

## 4. Escopo entregue (Sprints 00–12A)

| Área                   | Entregas                                                                    |
| ---------------------- | --------------------------------------------------------------------------- |
| Foundation             | Next.js, layout, apiClient, auth token, guards                              |
| Auth                   | Login, registro, sessão, redirect                                           |
| Eventos                | Catálogo, detalhe, eventos privados, participação gratuita                  |
| Bookings / checkout    | Reserva temporária, checkout mock, pagamento de evento pago                 |
| Conta                  | Perfil, inscrições, bookings, pagamentos, notificações                      |
| Arenas                 | Hub por ID, detalhe, espaços, slots, reserva SINGLE                         |
| Reserva + pagamento    | Lista/detalhe, cancelamento, checkout mock de reserva                       |
| Hardening (10)         | Request id, 429, idempotência, polling centralizado, cache terminal         |
| Organizador (11)       | CRUD mínimo de eventos, listagem `GET /users/me/events`                     |
| Admin (12A)            | Hub `/admin`, listagens operacionais, ações de status com motivo            |
| Dono de arena (13A–14) | Hub `/owner`, listagem, espaços, slots, reservas, agenda operacional diária |

## 5. Perfis e áreas da UI

| Perfil                  | Áreas no frontend atual                                                            |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Participante            | Eventos, inscrição, checkout pago, conta, arenas, reservas                         |
| Organizador             | `/account/events` — criar, editar, publicar, cancelar                              |
| Dono de arena (13A–13C) | `/owner/*` — hub, listagem, navegação contextual, espaços, slots, reservas, agenda |
| Admin                   | `/admin/*` — operação da plataforma (separado do owner)                            |

## 6. Integração com a API

- Base URL: `NEXT_PUBLIC_API_URL`.
- Auth: `Authorization: Bearer <token>`.
- Envelope: `{ success, data, meta? }` / `{ success: false, error }`.
- Headers: `X-Request-Id` (todas as requisições), `Idempotency-Key` (ações sensíveis documentadas).

## 7. Fora de escopo / instável

- **Recorrência** semanal e pagamento por ocorrência.
- **Gateway real** (PIX/cartão de produção).
- **Webhook no browser** — confirmação mock via backend em dev.
- Dashboard analítico admin, CRUD completo de arenas/slots além do já exposto.
- **`PATCH /users/me`**, módulo `/search`, listagem global `GET /arenas`.

## 8. Próximos passos sugeridos

1. Painel do dono de arena ou gestão avançada de arenas — conforme produto.
2. Manter contrato em `api-contract-map.md` ao evoluir a API.
