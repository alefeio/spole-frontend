# Sprint 12A — Admin UI operacional mínima

## Objetivo

Entregar um painel administrativo operacional no frontend (`/web`), com hub, listagens paginadas, filtros reais, detalhes read-only e ações seguras já expostas pela API — **sem** alterar o backend e **sem** painel do dono de arena.

## Escopo entregue

- Hub `/admin` com atalhos e totais via `meta.total` (`page=1&limit=1`)
- `/admin/users` — listagem, filtros, detalhe, `PATCH` status com motivo
- `/admin/events` — listagem, filtros, detalhe read-only (`GET /events/:id`), cancelamento com motivo
- `/admin/reservations` — listagem, filtros, detalhe read-only (`GET /reservations/:id`)
- `/admin/payments` — listagem, filtros, detalhe read-only (`GET /payments/:id`)
- `/admin/arenas` — listagem, filtros, detalhe read-only (`GET /arenas/:id`), `PATCH` status com motivo
- `/admin/audit` — listagem e filtros de `GET /admin/audit-logs`
- `/admin/bookings` — listagem read-only (`GET /admin/bookings`)
- Navegação admin no `AdminLayout`
- Mensagens de erro admin em português
- Componentes base em `src/features/admin/`

## Fora de escopo

- Painel do dono de arena, CRUD completo de arenas, slots, recorrência
- Gateway real, webhook no browser, BI/relatórios
- Alteração de role, edição avançada de usuários
- Publicar/editar evento pelo admin
- Cancelar reserva/booking/pagamento pelo admin
- Endpoints inventados ou alterações em `/api`

## Endpoints usados

| Área       | Listagem                  | Detalhe                 | Ação                                                      |
| ---------- | ------------------------- | ----------------------- | --------------------------------------------------------- |
| Usuários   | `GET /admin/users`        | `GET /admin/users/:id`  | `PATCH /admin/users/:id/status` + `reason`                |
| Arenas     | `GET /admin/arenas`       | `GET /arenas/:id`       | `PATCH /admin/arenas/:id/status` + `reason`               |
| Eventos    | `GET /admin/events`       | `GET /events/:id`       | `PATCH /admin/events/:id/status` (`CANCELLED` + `reason`) |
| Reservas   | `GET /admin/reservations` | `GET /reservations/:id` | —                                                         |
| Pagamentos | `GET /admin/payments`     | `GET /payments/:id`     | —                                                         |
| Bookings   | `GET /admin/bookings`     | —                       | —                                                         |
| Auditoria  | `GET /admin/audit-logs`   | —                       | —                                                         |

## Filtros suportados (query params reais)

- **Users:** `page`, `limit`, `status`, `role`, `email`
- **Events:** `page`, `limit`, `status`, `type`, `organizerId`, `city`
- **Reservations:** `page`, `limit`, `status`, `organizerId`, `type`
- **Payments:** `page`, `limit`, `status`, `userId`, `bookingId`, `reservationId`
- **Arenas:** `page`, `limit`, `status`, `ownerId`, `city`
- **Bookings:** `page`, `limit`, `status`, `userId`, `eventId`
- **Audit:** `page`, `limit`, `actorUserId`, `resourceType`, `action`, `dateFrom`, `dateTo`

## Paginação

Todas as listagens usam `meta.page`, `meta.limit`, `meta.total` do envelope da API.

## Segurança / roles

- Rotas em `(admin)` com `AuthGuard` + `AdminGuard` (`role === "admin"`)
- Usuário não admin: `AccessDenied`
- Motivo obrigatório (1–500 caracteres) em ações críticas via `AdminReasonDialog`
- `ADMIN_CANNOT_MODIFY_SELF` ao alterar o próprio usuário

## Mobile

- Listas em cards, filtros empilhados, `min-h-11` em botões
- IDs com `break-all`, metadata de auditoria colapsável

## Arquivos principais

- `src/lib/api/endpoints.ts` — bloco `admin`
- `src/features/admin/` — base UI + hub
- `src/features/admin-{users,events,reservations,payments,arenas,audit,bookings}/`
- `src/app/(admin)/admin/**`
- `src/components/layout/admin-layout.tsx`

## Critérios de aceite

- [x] `pnpm lint` e `pnpm build` passam
- [x] Nenhum arquivo em `/api` alterado
- [x] Nenhum `fetch` fora de `src/lib/api/client.ts`
- [x] Guards em rotas admin
- [x] Filtros e paginação reais
- [x] Ações com confirmação e motivo

## Pendências conhecidas

- Dashboard analítico / métricas agregadas (sem endpoint)
- Detalhe admin dedicado para reservas/pagamentos (usa rotas de domínio)
- Gestão de categorias admin (fora desta sprint)

## Próximos passos

- Painel do dono de arena (escopo separado)
- CRUD organizador avançado / relatórios conforme API futura
