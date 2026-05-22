# Sprint 08 — Arenas, espaços, slots e reservas SINGLE

## Objetivo

Implementar o fluxo participante de arenas, espaços, slots e reservas avulsas (`SINGLE`), sem pagamento de reserva e sem recorrência.

## Escopo

- Hub público `/arenas` (sem catálogo global)
- Detalhe público de arena e lista de espaços
- Seleção de data e listagem de slots disponíveis por espaço
- Criação de reserva `SINGLE` autenticada
- Área autenticada: minhas reservas, detalhe e cancelamento
- Navegação mobile-first em `PublicLayout` e `AppLayout`
- Mensagens de erro de reserva/arena em português
- Atalhos em Dashboard e Conta

## Fora de escopo

- `GET /arenas`, `GET /spaces/:id`
- `POST /reservations/:id/payments`, webhooks, gateway real
- `type: RECURRING`, recorrência na UI
- Admin/CRUD de arenas, spaces ou slots
- `/search`, edição de perfil
- Alterações em `/api`

## Endpoints usados

| Método | Rota                       | Uso                                                       |
| ------ | -------------------------- | --------------------------------------------------------- |
| GET    | `/arenas/:id`              | Detalhe público da arena                                  |
| GET    | `/arenas/:arenaId/spaces`  | Espaços da arena                                          |
| GET    | `/spaces/:spaceId/slots`   | Slots disponíveis (`page`, `limit`, `dateFrom`, `dateTo`) |
| POST   | `/reservations`            | Criar reserva `{ slotId, type: "SINGLE" }`                |
| GET    | `/reservations/me`         | Lista autenticada                                         |
| GET    | `/reservations/:id`        | Detalhe autenticado                                       |
| PATCH  | `/reservations/:id/cancel` | Cancelamento com confirmação                              |

## Fluxo de arenas

1. Usuário abre `/arenas` (hub informativo).
2. Informa UUID da arena e navega para `/arenas/[arenaId]`.
3. Página carrega `GET /arenas/:id` e `GET /arenas/:arenaId/spaces`.
4. Se `status !== ACTIVE`, CTAs de reserva ficam bloqueados com mensagem clara.
5. Política exibida somente como informação (`minAdvanceHours`, `allowRecurring`, `minReservationPaymentPercent`).

## Fluxo de espaços

1. Na página da arena, cards de espaço vêm de `GET /arenas/:arenaId/spaces`.
2. Espaços inativos permanecem visíveis, sem CTA de horários.
3. Espaços ativos com arena ativa: link para `/arenas/[arenaId]/spaces/[spaceId]`.

## Fluxo de slots

1. Rota de espaço resolve o space por ID na lista da arena (não existe `GET /spaces/:id`).
2. Usuário escolhe data (`input type="date"`).
3. Front envia `dateFrom`/`dateTo` em ISO com offset local (`dayRangeFromDateInput`).
4. `GET /spaces/:spaceId/slots` com paginação (`limit` 50).
5. API retorna apenas slots disponíveis — sem cálculo de disponibilidade no front.
6. Empty: “Não há horários disponíveis para esta data.”

## Fluxo de reserva SINGLE

1. Usuário seleciona slot.
2. Deslogado: CTA “Entrar para reservar” com `redirect` para a rota atual.
3. Logado: `POST /reservations` com `{ slotId, type: "SINGLE" }`.
4. Sucesso: redirect para `/account/reservations/[id]`.
5. Status exibido sem transformação (`PENDING`, `CONFIRMED`, etc.).
6. `PENDING`: mensagem de pagamento futuro, sem CTA de pagamento.

## Minhas reservas

- `/account/reservations` — `GET /reservations/me`, cards com status e horário do slot quando presente.
- `/account/reservations/[reservationId]` — detalhe, financial em leitura, recorrência só aviso/leitura mínima.

## Cancelamento

- Disponível para `PENDING` e `CONFIRMED` (API rejeita `CONSUMED`).
- `ConfirmDialog` antes de `PATCH /reservations/:id/cancel`.
- Cache TanStack Query revalidado via `reservationsKeys.all` e `slotsKeys.all`.

## Decisões técnicas

| Decisão                                                                  | Motivo                                 |
| ------------------------------------------------------------------------ | -------------------------------------- |
| Hub por ID, sem `GET /arenas`                                            | Endpoint não existe no backend         |
| Space resolvido na lista da arena                                        | `GET /spaces/:id` não existe           |
| `iso-day-range.ts` para query de data                                    | Intervalo do dia local com offset      |
| Features `arenas`, `slots`, `reservations`; cards em `spaces/components` | Alinhado ao contrato e reuso           |
| `hasToken()` + `useMe()` na reserva                                      | Redirect de login e feedback de sessão |
| Sem pagamento/recorrência na UI                                          | Escopo fechado da sprint               |

## Tratamento de erros

Códigos mapeados em `error-messages.ts`: `SLOT_NOT_FOUND`, `SLOT_UNAVAILABLE`, `RECURRENCE_NOT_ALLOWED`, `MIN_ADVANCE_VIOLATION`, `RESERVATION_CONFLICT`, `INVALID_SLOT_PRICE`, `RESERVATION_NOT_FOUND`, `FORBIDDEN`, `RESERVATION_ALREADY_CONSUMED`, `ARENA_NOT_FOUND`, `SPACE_NOT_FOUND`, `VALIDATION_ERROR` (já existente).

## Ajustes mobile realizados

- Cards em coluna única; grid progressivo em `sm`/`lg`
- Chips/cards de slot com `min-h-11`
- Input de data com altura confortável
- Botões `min-h-11` no mobile
- UUIDs com `break-all`
- Sem tabelas nas telas novas

## Arquivos criados/alterados

**Novos**

- `src/lib/date/iso-day-range.ts`
- `src/features/arenas/` (api, hooks, types, components)
- `src/features/spaces/components/` (space-card, spaces-empty-state, space-slots-booking)
- `src/features/slots/` (api, hooks, types, components)
- `src/features/reservations/` (api, hooks, types, components)
- `src/app/(public)/arenas/` (hub, detalhe, slots)
- `src/app/(app)/account/reservations/` (lista, detalhe)
- `docs/01-sprints/sprint-08-arenas-spaces-slots-reservations.md`

**Alterados**

- `src/lib/api/error-messages.ts`
- `src/components/layout/public-layout.tsx`
- `src/components/layout/app-layout.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/(app)/account/page.tsx`

## Critérios de aceite

- [x] `/arenas` é hub informativo, sem catálogo inventado
- [x] Detalhe e espaços usam endpoints reais
- [x] Slots com `dateFrom`/`dateTo`/`page`/`limit`
- [x] Reserva `POST /reservations` + `type: SINGLE`
- [x] Login obrigatório antes de reservar (redirect)
- [x] Minhas reservas e detalhe autenticados
- [x] Cancelamento com confirmação
- [x] Status sempre da API
- [x] Sem pagamento/recorrência/GET inventados
- [x] Nenhum `fetch` fora de `apiClient` + `features/*/api.ts`
- [x] Nenhuma alteração em `/api`
- [x] `pnpm lint` e `pnpm build` passam

## Pendências conhecidas

- Pagamento de reserva (`POST /reservations/:id/payments`) — sprint futura
- Recorrência (`RECURRING`) — sprint futura
- Descoberta de arenas além de link/ID — depende de `GET /arenas` no backend

## Próximos passos

- Sprint de pagamento mock de reserva de arena (quando priorizado)
- Painel do dono de arena (`GET /arenas/:arenaId/reservations`)
- Melhorias de descoberta se o backend expuser listagem pública
