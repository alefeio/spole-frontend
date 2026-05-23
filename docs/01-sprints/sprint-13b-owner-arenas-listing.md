# Sprint 13B — Listagem “Minhas arenas” (painel do dono)

## Objetivo

Entregar a listagem real das arenas do dono autenticado em `/owner/arenas`, consumindo `GET /users/me/arenas`, com filtros, paginação e atalhos para detalhe, espaços, reservas e agenda.

## Escopo

- Endpoint `endpoints.users.myArenas` → `GET /users/me/arenas`
- Tipos `OwnerArenaListItem`, `OwnerArenasListParams`, `OwnerArenasListResponse`
- `listMyArenas` + `useMyArenas` (TanStack Query, query key com filtros/página)
- Rota `/owner/arenas` com filtros `q`, `status`, `city`, ordenação `sort`/`order`, paginação via `meta`
- Componentes de listagem (card, filtros, paginação, empty/error/skeleton)
- Hub `/owner` prioriza “Minhas arenas”; abrir por ID permanece como suporte
- Nav do `OwnerLayout`: link “Minhas arenas”
- Revalidação da listagem após `POST /arenas` e `PATCH /arenas/:id`
- Dashboard e conta: CTAs para `/owner/arenas`

## Fora de escopo

- Pagamentos agregados, relatórios/BI, recorrência, gateway real, webhook no browser
- Endpoints admin (`GET /admin/arenas`, etc.)
- Edição/deleção de slots ou spaces além do já existente
- Agregados de reservas nos cards da listagem
- Alterações em `/api`

## Endpoint

`GET /users/me/arenas`

- JWT obrigatório
- Role `arena_owner`
- Ownership fixo no servidor (`ownerId` em query é ignorado)
- Paginação: `page`, `limit` + `meta.total`

### Filtros suportados na UI

| Query    | Uso na UI                            |
| -------- | ------------------------------------ |
| `q`      | Busca (nome, slug, cidade)           |
| `status` | `ACTIVE` \| `INACTIVE`               |
| `city`   | Cidade                               |
| `sort`   | `name` \| `createdAt` \| `updatedAt` |
| `order`  | `asc` \| `desc`                      |

Padrão na listagem: `sort=createdAt`, `order=desc` (quando ausente na URL).

### Dados na listagem (`data[]`)

`id`, `ownerId`, `name`, `slug`, `status`, `city`, `state`, `createdAt`, `updatedAt`

### Diferença listagem × detalhe

A listagem é enxuta. Endereço completo, política, documento, telefone e demais campos vêm de `GET /arenas/:id` nas telas de detalhe/edição.

## Hub `/owner`

- Card principal “Minhas arenas” → `/owner/arenas`
- CTA “Criar nova arena” mantido
- “Abrir arena por ID” como fluxo secundário (UUID)
- Removida copy sobre ausência do endpoint de listagem

## Cache / revalidação

- Query key: `["owner", "arenas", "my-list", params]`
- `useCreateArena` e `usePatchArena` invalidam `ownerArenasKeys.myLists()`
- `placeholderData` na listagem para transição suave entre páginas/filtros

## Mobile

- Cards empilhados, filtros em grid responsivo, botões `min-h-11`
- Slug/IDs com `break-all` quando exibidos
- Paginação via `PaginationControls` compartilhado

## Arquivos principais

| Área              | Caminhos                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Endpoint          | `src/lib/api/endpoints.ts`                                                                              |
| API / hooks       | `src/features/owner-arenas/api.ts`, `hooks.ts`, `types.ts`                                              |
| UI listagem       | `src/features/owner-arenas/components/owner-arenas-*.tsx`, `owner-arena-card.tsx`                       |
| Rota              | `src/app/(owner)/owner/arenas/page.tsx`                                                                 |
| Hub / nav         | `src/features/owner/components/owner-hub.tsx`, `src/components/layout/owner-layout.tsx`, `nav-link.tsx` |
| Conta / dashboard | `src/app/(app)/dashboard/page.tsx`, `account/page.tsx`                                                  |

## Critérios de aceite

- [ ] `pnpm lint` e `pnpm build` passam
- [ ] Nenhum arquivo em `/api` alterado
- [ ] `/owner/arenas` usa apenas `GET /users/me/arenas` para listar
- [ ] Filtros `q`, `status`, `city` e paginação real via `meta`
- [ ] Cards linkam para detalhe, espaços, reservas e agenda
- [ ] Após criar/editar arena, listagem reflete mudanças
- [ ] `arena_owner` via `OwnerGuard`; usuário comum vê `AccessDenied`
- [ ] Empty state com CTA “Criar primeira arena”

## Próximos passos sugeridos

- Contador de arenas no dashboard (opcional, via `meta.total` da listagem)
- Melhorias de busca (debounce / submit explícito)
- Gestão avançada de políticas e relatórios (fora do escopo atual)
