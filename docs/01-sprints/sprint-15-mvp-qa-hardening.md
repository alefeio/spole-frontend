# Sprint 15 — QA operacional, hardening final e preparação do MVP web

## Objetivo

Fechar o MVP web com homologação operacional, correções pontuais de UX/copy, revisão de permissões e documentação para demonstração e validação do produto — **sem** novas features grandes.

## Escopo

- Checklist manual [`../03-qa/mvp-operational-checklist.md`](../03-qa/mvp-operational-checklist.md)
- Copy de pagamento de reserva de arena alinhada à Sprint 09
- Redirect de login preservando `privateCode` em eventos privados
- Mensagens de erro adicionais em `error-messages.ts`
- Revisão de guards/menus (sem mudança de regra)
- Invalidação de cache pontual (`useCreateReservation`)
- Atualização de `frontend-overview.md`, `api-contract-map.md`, `README.md`

## Fora de escopo

Recorrência operacional, lote/PATCH/DELETE de slots, ações do dono sobre reservas, pagamentos agregados da arena, BI, gateway real, webhook no browser, `GET /arenas` global, `/search`, `PATCH /users/me`, migração para cookies, redesign, reescrita do `apiClient`, E2E automatizado obrigatório, alterações em `/api`.

## Alinhamento com o MVP

O Spolê valida participação em eventos, reserva de arenas e operação mínima da plataforma. Após Sprints 00–14, o frontend cobre os quatro papéis; a Sprint 15 aumenta **confiança operacional** para demo/homologação.

## Fluxos revisados

- Participante: eventos, checkout, reservas de arena, pagamentos mock, notificações
- Organizador: CRUD mínimo de eventos
- Admin: listagens e ações com motivo
- Dono: arenas, espaços, slots, reservas, agenda

## Correções feitas

| Item                              | Arquivo(s)                                      |
| --------------------------------- | ----------------------------------------------- |
| Copy pagamento reserva            | `space-slots-booking.tsx`, `arena-detail.tsx`   |
| `privateCode` no redirect         | `event-participation-cta.tsx`, `event-links.ts` |
| Erros PT adicionais               | `error-messages.ts`                             |
| Cache reserva criada              | `reservations/hooks.ts`                         |
| `PAYMENT_ALREADY_EXISTS` genérico | `error-messages.ts`                             |

## Checklist criado

[`docs/03-qa/mvp-operational-checklist.md`](../03-qa/mvp-operational-checklist.md) — cenários P/O/A/D + cross-cutting.

## Revisão mobile

Sem redesign. Mantidos padrões existentes (`min-h-11`, `break-all`, filtros empilhados, `overflow-x-auto` na navegação owner). Regressão dirigida via checklist.

## Revisão de permissões

Confirmado: `AuthGuard` + `AdminGuard` / `OwnerGuard`; menus condicionais em `AppLayoutShell`; admin não usa `OwnerLayout`.

## Arquivos principais

- `docs/03-qa/mvp-operational-checklist.md` (novo)
- `docs/01-sprints/sprint-15-mvp-qa-hardening.md` (este arquivo)
- `docs/00-product/frontend-overview.md`
- `docs/02-features/api-contract-map.md`
- `README.md`
- `src/features/events/event-links.ts`
- `src/features/events/components/event-participation-cta.tsx`
- `src/features/spaces/components/space-slots-booking.tsx`
- `src/features/arenas/components/arena-detail.tsx`
- `src/lib/api/error-messages.ts`
- `src/features/reservations/hooks.ts`

## Critérios de aceite

- [x] Checklist QA criado
- [x] Copy obsoleta corrigida
- [x] Redirect privado preserva query
- [x] Erros mapeados em PT
- [x] Documentação principal atualizada
- [ ] Execução manual completa do checklist (homologação contínua)

## Pendências conhecidas

- Filtros server-side em `GET /arenas/:arenaId/reservations`
- Gestão de bookings pagos pelo organizador
- Recorrência na UI
- `PATCH /users/me`
- `GET /arenas` global
- Dono não cancela/confirma reservas (sem rota)

## Próximos passos

1. Executar checklist com seed fresco antes de cada demo.
2. Evoluir API conforme pendências; atualizar `api-contract-map.md`.
3. Considerar E2E Playwright apenas quando houver infraestrutura acordada.
