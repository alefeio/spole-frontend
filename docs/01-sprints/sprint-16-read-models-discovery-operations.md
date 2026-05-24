# Sprint 16 — Catálogo público de arenas e operação do evento do organizador

## Objetivo

Alinhar o frontend aos read models do backend: catálogo público de arenas (`GET /arenas`) e operação do evento do organizador (summary, bookings, payments por evento).

## Escopo

- `GET /arenas` com busca, filtros e paginação em `/arenas`
- `GET /events/:eventId/summary`, `/bookings`, `/payments` no detalhe do organizador
- Atualização de endpoints, types, api, hooks e componentes
- Copy pública sem “buscar por ID” como fluxo principal
- Abertura direta por código em `<details>` secundário

## Fora de escopo

Geolocalização, mapa, ranking, BI, relatórios avançados, recorrência, check-in, ações sobre pagamento, webhook no browser, alterações em `/api`, uso de `/admin/*` no fluxo do organizador.

## Endpoints

| Rota                            | Uso                                           |
| ------------------------------- | --------------------------------------------- |
| `GET /arenas`                   | Catálogo público `/arenas`                    |
| `GET /arenas/:id`               | Detalhe (inalterado)                          |
| `GET /users/me/arenas`          | Painel dono `/owner/arenas`                   |
| `GET /users/me/events`          | Organizador `/account/events`                 |
| `GET /events/:id`               | Detalhe enriquecido (organizador autenticado) |
| `GET /events/:eventId/summary`  | Resumo operacional                            |
| `GET /events/:eventId/bookings` | Bookings do evento (paginado)                 |
| `GET /events/:eventId/payments` | Pagamentos do evento (paginado)               |

## Decisões

- Summary **não** é calculado no cliente — apenas exibição.
- Evento **FREE**: summary + participantes; painéis de bookings/payments só em **PAID**.
- Listagem pública de arenas retorna apenas arenas **ACTIVE** (regra da API).
- Fluxo “código/link direto” permanece como suporte em `/arenas` e no hub owner.

## Arquivos principais

- `src/lib/api/endpoints.ts`
- `src/features/arenas/*` (catalog, api, hooks, types)
- `src/features/events/api.ts`, `hooks.ts`, `types.ts`
- `src/features/events/components/organizer-event-operations.tsx`
- `src/features/events/components/event-summary-card.tsx`
- `src/features/events/components/event-bookings-panel.tsx`
- `src/features/events/components/event-payments-panel.tsx`
- `src/app/(public)/arenas/page.tsx`
- `src/app/(public)/page.tsx`

## Critérios de aceite

- [ ] `/arenas` usa `GET /arenas` com `q`, filtros e paginação
- [ ] Organizador usa summary/bookings/payments do evento (não admin)
- [ ] `pnpm lint` e `pnpm build` passam

## Pendências backend

Filtros server-side em reservas do dono; ações do dono sobre reservas; recorrência na UI.
