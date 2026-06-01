# Sprint 17 — Correções pós-homologação dos read models

## Objetivo

Sprint curta de **correção e hardening** após a Sprint 16. Sem novas features:
corrigir cache da operação do evento, cache após pagamento mock de booking,
copy/UX do catálogo público de arenas, estabilidade dos filtros de `/arenas`,
copy em português nos painéis operacionais e atualizar QA/docs.

## Escopo

- Cache: invalidar `summary`/`bookings`/`payments` do evento nas mutações de evento e nos fluxos de booking/pagamento.
- Catálogo `/arenas`: copy (sem “Hub de arenas”), abertura direta como suporte secundário, filtros estáveis.
- Painéis operacionais: títulos e status em português.
- Card público: exibir `addressName` (campo já retornado pela listagem).
- QA: cenário **O-12**; revisão de **P-11**.
- Documentação da sprint + ajustes nos docs existentes.

## Fora de escopo

Mapa/geolocalização, ranking/avaliações/favoritos, BI/relatórios avançados,
check-in, ações sobre pagamentos, webhook no browser, recorrência, endpoints
novos, alterações em `/api`, redesign, reescrita do `apiClient`, migração de
auth, gateway real, slug lookup no backend, reestruturação do painel owner.

## Endpoints (sem novidades)

`GET /arenas`, `GET /arenas/:id`, `GET /users/me/events`, `GET /events/:id`,
`GET /events/:eventId/summary`, `GET /events/:eventId/bookings`,
`GET /events/:eventId/payments` e endpoints de booking/payment já existentes.

## Problemas corrigidos

### 1. Cache da operação do evento

`invalidateEventCaches` invalidava `details`/`lists`/`mine`/`participants`, mas
não as read models operacionais. Criado o helper `invalidateEventOperations(queryClient, eventId?)`
em `features/events/hooks.ts`:

- com `eventId`: invalida `summary(eventId)`, `bookingsByEvent(eventId)`, `paymentsByEvent(eventId)`;
- sem `eventId`: invalida os prefixos operacionais (`summaries`, `bookingsAll`, `paymentsAll`).

Chamado dentro de `invalidateEventCaches`, cobrindo `createEvent`, `updateEvent`
(publicar), `cancelEvent`.

### 2. Cache após booking/pagamento mock

- `bookings/hooks.ts`: `useCreateBooking` invalida operação por `eventId` (vem nas variables); `useCancelBooking` invalida por prefixo.
- `payments/invalidate-payment-caches.ts`: ao atingir status terminal com `bookingId`, invalida a operação por prefixo (o pagamento de booking não carrega `eventId`; nenhum request extra é criado para descobri-lo).
- `payments/hooks.ts`: `useCreatePaymentForBooking` também invalida a operação por prefixo (muda `pendingPaymentsCount`).

Resultado: após o webhook de teste confirmar o pagamento, o organizador vê
`summary`/`bookings`/`payments` atualizados **sem F5**.

### 3. Catálogo de arenas (copy)

- “Hub de arenas” → “Arenas” / “Voltar para arenas”.
- `arenas-direct-open.tsx`: rótulo “Tenho um link ou identificador direto da arena”; texto “Use esta opção apenas se você já recebeu um link ou identificador direto da arena”. Mantido como suporte secundário; sem busca fake por slug.

### 4. Filtros de `/arenas`

`arenas-filters.tsx`:

- `q`, `city`, `state`, `district` agora usam estado local (draft) sincronizado com a URL via `useEffect`.
- Aplicação por botão **Aplicar filtros** ou Enter — não dispara request a cada tecla.
- Limpar filtros reseta os campos locais.
- `page` volta para 1 ao aplicar; query params preservados na URL.

### 5. Copy dos painéis operacionais

- `event-bookings-panel.tsx`: título “Reservas/compras do evento”; status em PT (Reservado/Concluído/Expirado/Cancelado).
- `event-payments-panel.tsx`: status em PT (Pendente/Pago/Falhou/Cancelado/Reembolsado).
- Dados da API inalterados; IDs continuam com `break-all`.

### 6. Card público de arena

`arena-catalog-card.tsx` passa a exibir `addressName` (campo já presente na
listagem). Sem request de detalhe por card; sem dados sensíveis.

## Checklist QA

`docs/03-qa/mvp-operational-checklist.md`:

- **O-12** — operação do evento atualiza após pagamento mock sem F5.
- **P-11** — revisado para refletir “Aplicar filtros” e limpar filtros.

## Arquivos criados/alterados

**Código:**

- `src/features/events/hooks.ts` (keys operacionais + `invalidateEventOperations`)
- `src/features/bookings/hooks.ts`
- `src/features/payments/invalidate-payment-caches.ts`
- `src/features/payments/hooks.ts`
- `src/features/arenas/components/arenas-filters.tsx`
- `src/features/arenas/components/arenas-direct-open.tsx`
- `src/features/arenas/components/arena-catalog-card.tsx`
- `src/features/arenas/components/arena-error-state.tsx`
- `src/app/(public)/arenas/[arenaId]/page.tsx`
- `src/features/events/components/event-bookings-panel.tsx`
- `src/features/events/components/event-payments-panel.tsx`

**Docs:**

- `docs/01-sprints/sprint-17-post-homologation-read-models.md` (novo)
- `docs/01-sprints/sprint-16-read-models-discovery-operations.md` (critérios fechados)
- `docs/00-product/frontend-overview.md`
- `docs/03-qa/mvp-operational-checklist.md`

## Critérios de aceite

- [x] `pnpm lint` e `pnpm build` passam; `pnpm format:write` executado.
- [x] Nenhum arquivo em `/api` alterado; nenhum endpoint inventado.
- [x] Nenhum `fetch` fora de `src/lib/api/client.ts`.
- [x] `/arenas` continua em `GET /arenas`; ID não é fluxo principal.
- [x] Filtros de `/arenas` sincronizam com a URL e não disparam request a cada tecla.
- [x] Operação do evento usa `summary`/`bookings`/`payments` próprios; sem `/admin/*`.
- [x] Summary não é calculado no cliente.
- [x] Após pagamento mock confirmado, organizador vê dados atualizados sem F5.
- [x] Copy “Hub de arenas” removida; painéis operacionais em PT.
- [x] Checklist QA com **O-12**; doc da Sprint 17 criada; Sprint 16 fechada.
- [x] Sem `console.log` de debug.

## Pendências conhecidas

- O pagamento de booking não expõe `eventId`; a invalidação usa prefixo operacional (bounded às read models do evento). Mapear `bookingId → eventId` exigiria endpoint/contrato novo (fora de escopo).
- O-12 depende do webhook de teste no backend para confirmar o pagamento.

## Próximos passos

1. Filtros/paginação server-side em reservas do dono (depende da API).
2. Ações do dono sobre reservas e gestão avançada de slots, quando a API expuser.
3. Manter `02-features/api-contract-map.md` sincronizado.
