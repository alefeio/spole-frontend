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
4. **Sem antecipar backend** — não construir telas para rotas inexistentes.

## 4. Escopo entregue (Sprints 00–15)

| Área                  | Entregas                                                             |
| --------------------- | -------------------------------------------------------------------- |
| Foundation            | Next.js, layout, apiClient, auth token, guards                       |
| Auth                  | Login, registro, sessão, redirect                                    |
| Eventos               | Catálogo, detalhe, eventos privados, participação gratuita           |
| Bookings / checkout   | Reserva temporária, checkout mock, pagamento de evento pago          |
| Conta                 | Perfil, inscrições, bookings, pagamentos, notificações               |
| Arenas                | Catálogo `GET /arenas`, detalhe, espaços, slots, reserva SINGLE      |
| Reserva + pagamento   | Lista/detalhe, cancelamento, checkout mock de reserva                |
| Hardening (10)        | Request id, 429, idempotência, polling centralizado, cache terminal  |
| Organizador (11–16)   | CRUD eventos, listagem `GET /users/me/events`, operação por evento   |
| Admin (12A)           | Hub `/admin`, listagens operacionais, ações de status com motivo     |
| Dono de arena (13–14) | Hub `/owner`, listagem, espaços, slots, reservas, agenda operacional |
| QA / MVP (15)         | Checklist de homologação, copy/guards/erros, docs de prontidão       |
| Read models (16)      | Catálogo público de arenas; summary/bookings/payments do organizador |

## 5. Perfis e áreas da UI

| Perfil        | Áreas no frontend atual                                                     |
| ------------- | --------------------------------------------------------------------------- |
| Participante  | Eventos, inscrição, checkout pago, conta, catálogo de arenas, reservas      |
| Organizador   | `/account/events` — CRUD, publicar, operação (summary/bookings/payments)    |
| Dono de arena | `/owner/*` — hub, minhas arenas, espaços, slots, reservas recebidas, agenda |
| Admin         | `/admin/*` — operação da plataforma (separado do painel dono)               |

Homologação manual: [`../03-qa/mvp-operational-checklist.md`](../03-qa/mvp-operational-checklist.md).

## 6. Integração com a API

- Base URL: `NEXT_PUBLIC_API_URL`.
- Auth: `Authorization: Bearer <token>`.
- Envelope: `{ success, data, meta? }` / `{ success: false, error }`.
- Headers: `X-Request-Id` em mutações (e quando há `Idempotency-Key`); `Idempotency-Key` em bookings e pagamentos sensíveis.

## 7. Limitações conscientes do MVP web

- **Recorrência** — sem wizard operacional; dados podem aparecer somente leitura.
- **Gateway real** — pagamentos mock (`mock-provider`); confirmação via backend/webhook de teste em dev.
- **Webhook no browser** — não implementado.
- **Arenas** — catálogo em `GET /arenas`; abertura por código/link como suporte secundário.
- **Dono** — reservas da arena com filtros **no cliente**; sem cancelar/confirmar reserva pelo dono.
- **Slots** — criação unitária; sem PATCH/DELETE/bloqueio.
- **Organizador** — operação por evento via read models; sem ações financeiras no front.
- **Perfil** — sem `PATCH /users/me`.
- **Busca** — apenas `GET /events?q=...` (sem `/search`).

## 8. Próximos passos (produto / backend)

1. Filtros e paginação server-side em reservas da arena.
2. Ações do dono sobre reservas e gestão avançada de slots, quando a API expuser.
3. Manter [`../02-features/api-contract-map.md`](../02-features/api-contract-map.md) sincronizado.
