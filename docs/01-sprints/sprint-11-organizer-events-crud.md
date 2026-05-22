# Sprint 11A — CRUD mínimo de eventos do organizador

## Objetivo

Permitir que o usuário autenticado crie e gerencie eventos como organizador, sem depender de listagem completa “meus eventos” (endpoint inexistente).

## Escopo

- Hub `/account/events` com CTAs (sem listagem falsa)
- Criar evento `FREE_LOCATION` em `/account/events/new`
- Criar evento `ARENA_RESERVATION` em `/account/reservations/[id]/create-event` (reserva `CONFIRMED`)
- Detalhe organizador `/account/events/[eventId]`
- Editar `/account/events/[eventId]/edit` via `PATCH /events/:id`
- Publicar via `PATCH` com `status: PUBLISHED` (botão no detalhe + formulário)
- Cancelar via `DELETE /events/:id`
- Link/código privado e copiar URL
- Participantes gratuitos `GET /events/:eventId/participants`
- Navegação: header, dashboard, conta, CTA na reserva confirmada
- Formulários com Zod; mutations TanStack Query; erros em português
- Mobile-first

## Fora de escopo

- `GET /events/me` e listagem completa de eventos do organizador
- Admin UI, painel dono de arena, recorrência
- Gateway real, webhook no browser
- Bookings/pagamentos do evento (organizador), check-in, relatórios, search
- Regenerar `privateCode`, alterações em `/api`

## Endpoints usados

| Método   | Rota                            | Uso                                        |
| -------- | ------------------------------- | ------------------------------------------ |
| `POST`   | `/events`                       | Criar (FREE_LOCATION ou ARENA_RESERVATION) |
| `GET`    | `/events/:id`                   | Detalhe organizador (auth)                 |
| `PATCH`  | `/events/:id`                   | Editar / publicar                          |
| `DELETE` | `/events/:id`                   | Cancelar                                   |
| `GET`    | `/events/:eventId/participants` | Inscrições gratuitas                       |
| `GET`    | `/categories`                   | Select de categoria                        |
| `GET`    | `/reservations/:id`             | Validar reserva antes de criar evento      |
| `GET`    | `/reservations/me`              | Atalho no hub                              |

## Limitação: ausência de GET /events/me

A listagem de todos os eventos do organizador (rascunhos, privados, etc.) **não** foi implementada. O hub explica a dependência de endpoint futuro. Após criar, o usuário é redirecionado para o detalhe pelo `id` retornado.

## Fluxos

### Evento em local livre

Dashboard ou Meus eventos → Criar evento → formulário completo → `POST /events` (`sourceType: FREE_LOCATION`) → `/account/events/[id]`.

### Evento a partir de reserva

Reserva `CONFIRMED` → “Criar evento nesta reserva” → formulário reduzido → `POST /events` (`ARENA_RESERVATION` + `reservationId`) → detalhe. Reserva pode virar `CONSUMED` no backend.

### Detalhe / edição / cancelamento

- Detalhe: status, visibilidade, origem, link, participantes (se `FREE`)
- Editar: `PATCH` (sem `CANCELLED` no body)
- Cancelar: `DELETE` (não `PATCH` com cancelado)
- Arena: data/local travados na edição

## Decisões técnicas

- `EventStatus` sem `FINISHED` (alinhado ao enum da API)
- Conversão `datetime-local` → ISO com offset (`datetime.ts`)
- `categoryId` não vem no `GET /events/:id` — edição de categoria opcional; endereço parcial no edit (rua/número/bairro não retornados)
- Cache: `eventsKeys` + `reservationsKeys` após criar/cancelar evento com reserva
- Todas as chamadas via `apiClient` em `features/events/api.ts`

## Tratamento de erros

Códigos mapeados em `error-messages.ts`: `INVALID_CATEGORY`, `INACTIVE_CATEGORY`, `INVALID_PRICE`, `INVALID_DATE_RANGE`, `INVALID_CAPACITY`, `RESERVATION_*`, `SLOT_INVALID_STATE`, `ARENA_ADDRESS_MISSING`, `FORBIDDEN`, `EVENT_*`, `INVALID_STATUS`.

## Arquivos principais

- `src/features/events/types.ts`, `schemas.ts`, `api.ts`, `hooks.ts`, `datetime.ts`, `event-links.ts`
- `src/features/events/components/event-form*.tsx`, `organizer-event-detail.tsx`, badges, `event-participants-panel.tsx`, `event-private-link-card.tsx`
- `src/app/(app)/account/events/**`
- `src/app/(app)/account/reservations/[reservationId]/create-event/page.tsx`
- `src/components/layout/app-layout.tsx`, dashboard, account, `reservation-detail.tsx`

## Critérios de aceite

- [ ] `pnpm lint` e `pnpm build` passam
- [ ] Nenhum arquivo em `/api` alterado
- [ ] Sem endpoints inventados nem `fetch` fora de `apiClient`
- [ ] Hub sem listagem falsa; rotas protegidas por `AuthGuard`
- [ ] Fluxos mobile sem overflow horizontal

## Pendências

- Listagem “meus eventos” quando API expuser rota (ex. `GET /users/me/events`)
- Gestão de bookings pagos do evento
- Exibir `categoryId`/endereço completo no detalhe se a API passar a retornar

## Próximos passos

- Sprint 11B: endpoint de listagem no backend + tela de lista no frontend
- Gestão avançada do evento (inscrições pagas, métricas)
