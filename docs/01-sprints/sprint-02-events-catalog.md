# Sprint 02 — Catálogo público de eventos

## Objetivo

Implementar o catálogo público de eventos usando os contratos reais do backend, com listagem, busca, filtro por categoria, paginação e estados de carregamento, vazio e erro.

## Escopo

- Listagem pública via `GET /events`
- Busca textual via query `q`
- Paginação via `page`, `limit` e `meta.total`
- Filtro por categoria via `GET /categories` + query `category`
- Cards responsivos com os campos reais do contrato
- Placeholder para `/events/[eventId]`, sem integração com detalhe
- Navegação pública com links para Home, Eventos e Login/Dashboard

## Fora de escopo

- Detalhe completo do evento (`GET /events/:id`)
- Booking, checkout e pagamento
- Inscrição gratuita
- Módulo `/search` dedicado
- Filtros sem UI nesta sprint (`city`, `dateFrom`, `dateTo`, `type`)
- Admin e CRUD de categorias

## Endpoints usados

| Método | Rota          | Uso                                 |
| ------ | ------------- | ----------------------------------- |
| GET    | `/events`     | Listagem pública, busca e paginação |
| GET    | `/categories` | Filtro por categoria                |

## Query params suportados

| Param      | Uso                      |
| ---------- | ------------------------ |
| `q`        | Busca textual em eventos |
| `category` | UUID da categoria        |
| `page`     | Página atual             |
| `limit`    | Itens por página         |

## Arquivos criados / alterados

```
src/features/events/types.ts
src/features/events/api.ts
src/features/events/hooks.ts
src/features/events/components/event-card.tsx
src/features/events/components/event-list.tsx
src/features/events/components/event-filters.tsx
src/features/events/components/event-search-input.tsx
src/features/events/components/event-pagination.tsx
src/features/events/components/event-list-skeleton.tsx
src/features/events/components/event-empty-state.tsx
src/features/events/components/event-error-state.tsx
src/features/events/components/events-catalog.tsx
src/app/(public)/events/page.tsx
src/app/(public)/events/[eventId]/page.tsx
src/components/layout/public-layout.tsx
src/components/layout/public-auth-link.tsx
```

## Decisões técnicas

| Decisão                        | Motivo                                             |
| ------------------------------ | -------------------------------------------------- |
| Busca por `GET /events?q=...`  | Não existe módulo `/search` no backend             |
| Categoria usa query `category` | Contrato real de `GET /events`                     |
| `GET /categories` no filtro    | Endpoint real e público                            |
| URL como fonte dos filtros     | Permite compartilhamento e navegação por histórico |
| Placeholder de detalhe         | Evita integrar `GET /events/:id` fora da sprint    |
| Cards sem disponibilidade      | Capacidade não equivale a disponibilidade real     |

## Critérios de aceite

- [x] `/events` lista eventos reais de `GET /events`
- [x] Busca usa `GET /events?q=...`
- [x] Paginação usa `page`, `limit` e `meta.total`
- [x] Filtro de categoria usa endpoint real `GET /categories`
- [x] Loading, empty e error states implementados
- [x] Nenhum `fetch` fora de `src/lib/api/client.ts`
- [x] Nenhum arquivo de `/api` alterado
- [x] Nenhum módulo `/search` criado
- [x] Booking, checkout e pagamento não implementados

## Próximos passos

1. Sprint 03: detalhe do evento com `GET /events/:id`
2. Acesso a evento privado com `privateCode`
3. Inscrição gratuita em evento (`POST /events/:eventId/participants/free`)
4. Preparar base para booking pago em sprint posterior
