# Sprint 13A — Painel do Dono de Arena

## Objetivo

Entregar o painel operacional do **dono de arena** (`/owner`), separado da Admin UI, com hub, criação de arena, gestão básica, espaços, horários disponíveis, reservas recebidas e agenda simples — usando apenas endpoints reais da API.

## Escopo entregue

- `OwnerGuard` + `OwnerLayout` (role `arena_owner`)
- Hub `/owner` com CTA criar arena e abrir por ID (sem listagem fake)
- `POST /arenas` → redirecionamento para detalhe
- Detalhe e `PATCH /arenas/:id` (edição básica, status ACTIVE/INACTIVE sem `reason`)
- Espaços: `GET` + `POST /arenas/:arenaId/spaces`
- Slots: `GET /spaces/:spaceId/slots` + `POST` criar horário
- Reservas recebidas: `GET /arenas/:arenaId/reservations` + detalhe `GET /reservations/:id`
- Agenda do dia (filtro client-side em reservas)
- Navegação: link “Painel da arena” para `arena_owner` em AppLayout, Dashboard e Conta

## Limitação conhecida

**Não existe** `GET /users/me/arenas` (nem `/arenas/me`). O hub **não** lista “Minhas arenas”. O dono deve:

1. Criar uma arena e ser redirecionado, ou
2. Abrir uma arena pelo UUID conhecido.

Quando a API expuser listagem, uma sprint futura adicionará a tela sem localStorage como solução principal.

## Fora de escopo

- Endpoints `/admin/*` no painel owner
- `GET /users/me/arenas` (inexistente)
- Listagem fake de arenas ou IDs em localStorage
- Pagamentos agregados da arena / `GET /payments/:id` de clientes
- Cancelar/confirmar/consumir reserva pelo dono
- Recorrência avançada, gateway, webhook no browser
- PATCH/DELETE de espaços e slots
- Alterações em `/api`

## Endpoints usados

| Área     | Métodos                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------ |
| Arenas   | `POST /arenas`, `GET /arenas/:id`, `PATCH /arenas/:id`, `GET .../spaces`, `GET .../reservations` |
| Spaces   | `POST /arenas/:arenaId/spaces`                                                                   |
| Slots    | `GET /spaces/:spaceId/slots`, `POST /spaces/:spaceId/slots`                                      |
| Reservas | `GET /reservations/:id` (dono autorizado)                                                        |

## Rotas

| Rota                                                   | Função             |
| ------------------------------------------------------ | ------------------ |
| `/owner`                                               | Hub                |
| `/owner/arenas/new`                                    | Criar arena        |
| `/owner/arenas/[arenaId]`                              | Detalhe            |
| `/owner/arenas/[arenaId]/edit`                         | Editar             |
| `/owner/arenas/[arenaId]/spaces`                       | Espaços            |
| `/owner/arenas/[arenaId]/spaces/[spaceId]/slots`       | Horários           |
| `/owner/arenas/[arenaId]/reservations`                 | Reservas recebidas |
| `/owner/arenas/[arenaId]/reservations/[reservationId]` | Detalhe            |
| `/owner/arenas/[arenaId]/agenda`                       | Agenda do dia      |

## Segurança

- `AuthGuard` + `OwnerGuard` em `(owner)`
- `user` → AccessDenied; `admin` usa `/admin`, não este painel
- Validação UX: `ownerId === me.id` no detalhe (API valida mutações)

## Mobile

- Cards, formulários `min-h-11`, filtros empilhados, IDs com `break-all`

## Arquivos principais

- `src/features/auth/components/owner-guard.tsx`
- `src/components/layout/owner-layout.tsx`
- `src/app/(owner)/`
- `src/features/owner/`, `src/features/owner-arenas/`
- `src/components/layout/app-layout-shell.tsx`

## Critérios de aceite

- [x] Lint e build passam
- [x] Sem alteração em `/api`
- [x] Sem endpoints inventados
- [x] Guards e separação owner/admin
- [x] Hub sem listagem fake
- [x] Fluxos POST/PATCH/GET conforme contrato

## Próximos passos

- Backend: `GET /users/me/arenas`
- Filtros/paginação em `GET /arenas/:id/reservations`
- Sprint 14: edição de slots, relatórios, painel financeiro quando houver API
