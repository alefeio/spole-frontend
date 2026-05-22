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

## 4. Escopo entregue (Sprints 00–10)

| Área                | Entregas                                                            |
| ------------------- | ------------------------------------------------------------------- |
| Foundation          | Next.js, layout, apiClient, auth token, guards                      |
| Auth                | Login, registro, sessão, redirect                                   |
| Eventos             | Catálogo, detalhe, eventos privados, participação gratuita          |
| Bookings / checkout | Reserva temporária, checkout mock, pagamento de evento pago         |
| Conta               | Perfil, inscrições, bookings, pagamentos, notificações              |
| Arenas              | Hub por ID, detalhe, espaços, slots, reserva SINGLE                 |
| Reserva + pagamento | Lista/detalhe, cancelamento, checkout mock de reserva               |
| Hardening (10)      | Request id, 429, idempotência, polling centralizado, cache terminal |

## 5. Perfis e áreas da UI

| Perfil        | Áreas no frontend atual                                    |
| ------------- | ---------------------------------------------------------- |
| Participante  | Eventos, inscrição, checkout pago, conta, arenas, reservas |
| Organizador   | Fluxos de participante (sem CRUD de eventos no front)      |
| Dono de arena | Sem painel dedicado                                        |
| Admin         | Sem painel (categorias admin só na API)                    |

## 6. Integração com a API

- Base URL: `NEXT_PUBLIC_API_URL`.
- Auth: `Authorization: Bearer <token>`.
- Envelope: `{ success, data, meta? }` / `{ success: false, error }`.
- Headers: `X-Request-Id` (todas as requisições), `Idempotency-Key` (ações sensíveis documentadas).

## 7. Fora de escopo / instável

- **Recorrência** semanal e pagamento por ocorrência.
- **Gateway real** (PIX/cartão de produção).
- **Webhook no browser** — confirmação mock via backend em dev.
- **Admin UI**, CRUD de eventos no front, painel do dono de arena.
- **`PATCH /users/me`**, módulo `/search`, listagem global `GET /arenas`.

## 8. Próximos passos sugeridos

1. Admin (API 11) ou CRUD de eventos ou gestão de arena — conforme produto.
2. Manter contrato em `api-contract-map.md` ao evoluir a API.
