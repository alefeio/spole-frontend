# Sprint 11B — Listagem real de Meus Eventos

## Objetivo

Destravar o fluxo completo do organizador: criar → listar → detalhe → editar/publicar/cancelar, usando `GET /users/me/events` e o payload completo de `GET /events/:id` para dono/admin.

## Escopo

- `GET /users/me/events` com filtros e paginação em `/account/events`
- Cards com badges, ações publicar/cancelar/editar/detalhe
- URL com query params (`page`, `q`, `status`, `visibility`, `type`, `sourceType`, `categoryId`)
- Detalhe e edição com `categoryId`, endereço completo, `locationReadOnly`, `privateCode` só no detalhe
- Cache: invalidação de `eventsKeys.mine()` após mutações
- Dashboard/conta com copy atualizada

## Fora de escopo

- `GET /admin/events`, bookings/payments por evento, financeiro, recorrência, admin, painel arena, alterações em `/api`

## Endpoints

| Método   | Rota               | Uso                                  |
| -------- | ------------------ | ------------------------------------ |
| `GET`    | `/users/me/events` | Listagem do organizador              |
| `GET`    | `/events/:id`      | Detalhe (payload completo para dono) |
| `PATCH`  | `/events/:id`      | Editar / publicar                    |
| `DELETE` | `/events/:id`      | Cancelar                             |
| `GET`    | `/categories`      | Filtro e formulários                 |

## GET /users/me/events

- JWT obrigatório; apenas eventos do `organizerId` autenticado
- Paginação: `page`, `limit` (máx. 100)
- Filtros: `q`, `status`, `visibility`, `type`, `sourceType`, `categoryId`, `dateFrom`, `dateTo`
- Ordenação: `sort` (`startAt` | `createdAt` | `updatedAt`), `order` (`asc` | `desc`, default `updatedAt` desc)
- **Não retorna** `privateCode`

## privateCode

- Obtido somente em `GET /events/:id` autenticado como organizador/admin
- `EventPrivateLinkCard` apenas no detalhe

## locationReadOnly

- `true` para `ARENA_RESERVATION`: formulário de edição não envia data/endereço no PATCH
- `false` para `FREE_LOCATION`: edição de `startAt`, `endAt` e endereço completo

## Cache

Após `createEvent` / `updateEvent` / `cancelEvent`:

- `eventsKeys.mine()`
- `eventsKeys.details()` / `detail(id)`
- `eventsKeys.lists()` (catálogo público)
- `reservationsKeys` quando aplicável

## Arquivos principais

- `src/features/events/types.ts` — `OrganizerEventListItem`, `OrganizerEventDetail`, params
- `src/features/events/api.ts` — `listMyEvents`
- `src/features/events/hooks.ts` — `useMyEvents`, `eventsKeys.mine`
- `src/features/events/components/organizer-events-*.tsx`
- `src/app/(app)/account/events/page.tsx`
- `src/lib/api/endpoints.ts` — `users.myEvents`

## Critérios de aceite

- [x] `pnpm lint` / `pnpm build`
- [x] `/account/events` lista eventos reais via `GET /users/me/events`
- [x] Filtros e paginação na URL
- [x] Sem `privateCode` na listagem
- [x] Edição respeita `locationReadOnly`
- [x] Documentação criada (`sprint-11b-organizer-events-listing.md`, `api-contract-map.md`)

## Próximos passos

- Bookings/pagamentos do evento para organizador
- Métricas de ocupação quando a API expuser
