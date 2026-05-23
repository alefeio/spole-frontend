# Sprint 14 — Operação diária: horários e agenda do dono

## Objetivo

Refinar a operação diária do dono de arena em horários disponíveis (slots), reservas recebidas e agenda, com presets de data, feedback de conflito, links cruzados e clareza entre inventário disponível e compromissos já reservados.

## Escopo

- Utilitários em `src/features/owner-arenas/utils/` (datas e filtros de reservas)
- `OwnerDatePresets`, `OwnerDayDateControls`, toolbar de slots
- Criação unitária de slot refinada + `SLOT_OVERLAP`
- Agenda com navegação de dia e resumo local
- Reservas com filtros client-side explícitos
- Links cruzados entre slots, reservas, agenda e espaços
- Estados owner padronizados (sem `AdminErrorState` no detalhe de reserva)
- Navegação contextual com labels mais curtas no mobile

## Fora de escopo

- Recorrência operacional, lote de slots, PATCH/DELETE/bloqueio de slot
- Cancelamento/confirmação/consumo de reserva pelo dono
- Pagamentos agregados, `GET /payments/:id` para clientes, BI, gateway, webhook no browser
- Endpoints admin, alterações em `/api`
- Calendário mensal pesado
- `GET /arenas/:arenaId/slots` agregado (opcional deixado de fora para manter escopo)

## Endpoints usados

| Endpoint                            | Uso                                              |
| ----------------------------------- | ------------------------------------------------ |
| `GET /spaces/:spaceId/slots`        | Listagem de horários disponíveis por espaço/data |
| `POST /spaces/:spaceId/slots`       | Criação unitária                                 |
| `GET /arenas/:arenaId/reservations` | Lista completa + filtros no client               |
| `GET /reservations/:id`             | Detalhe somente leitura                          |
| `GET /arenas/:arenaId/spaces`       | Contexto do espaço                               |

## Decisões de UX

- **Slots** = apenas `AVAILABLE` (API). Copy obrigatória sobre reservas na agenda/reservas.
- **Agenda** = reservas do dia (`slot.startAt`), filtro no navegador.
- **Resumo operacional** = contagem na lista já carregada, não relatório.
- **Presets** = alteram só a data; sem recorrência nem lote.
- Query `?date=` na agenda a partir do link em reservas filtradas.

## Arquivos principais

- `src/features/owner-arenas/utils/owner-date-presets.ts`
- `src/features/owner-arenas/utils/owner-reservation-filters.ts`
- `src/features/owner-arenas/components/owner-date-presets.tsx`
- `src/features/owner-arenas/components/owner-day-date-controls.tsx`
- `src/features/owner-arenas/components/slots/owner-slot-list-toolbar.tsx`
- `src/features/owner-arenas/components/owner-slot-overlap-help.tsx`
- `src/features/owner-arenas/components/owner-space-slots-view.tsx`
- `src/features/owner-arenas/components/owner-arena-agenda-view.tsx`
- `src/features/owner-arenas/components/owner-arena-reservations-view.tsx`
- `src/lib/api/error-messages.ts` (mensagem `SLOT_OVERLAP`)

## Pendências backend (futuro)

- `GET /arenas/:arenaId/reservations` com `dateFrom`/`dateTo`/`status`/`page`/`limit`
- Paginação server-side de reservas da arena
- PATCH/DELETE/bloqueio de slot, criação em lote
- Ações do dono sobre reservas
- Relatório financeiro / pagamentos agregados da arena

## Critérios de aceite

- [ ] `pnpm lint` e `pnpm build` passam
- [ ] Slots e agenda com copy de separação disponível vs reservado
- [ ] `SLOT_OVERLAP` com mensagem e ajuda contextual
- [ ] Presets Hoje/Amanhã/+7 dias sem recorrência
- [ ] Sem endpoints inventados nem fetch fora do `apiClient`

## Próximos passos

- Filtros de reservas no servidor quando a API expuser
- Visão agregada de slots por arena (`GET /arenas/:arenaId/slots`) se produto pedir
- Ações do dono sobre reservas quando houver rotas dedicadas
