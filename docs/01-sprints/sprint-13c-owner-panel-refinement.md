# Sprint 13C — Refinamento operacional do painel do dono

## Objetivo

Consolidar o uso diário do painel `/owner` com melhor UX em hub, listagem de arenas, navegação contextual por arena, espaços, horários (slots), reservas recebidas e agenda — sem ampliar escopo de API.

## Escopo

- Hub `/owner` com fluxo orientado (passos 1–4) e CTAs principais
- Listagem `/owner/arenas` refinada (filtros, cards, estados)
- Navegação contextual `OwnerArenaNavigation` (pills com scroll horizontal)
- Detalhe, edição, espaços, slots, reservas e agenda refinados
- Badges padronizados: arena, espaço, reserva, slot
- Estados visuais unificados via `section-state` (loading, empty, error, skeleton)
- Mensagens em português; mobile-first; `min-h-11` em CTAs

## Fora de escopo

- Endpoints `/admin/*`
- Pagamentos agregados da arena; `GET /payments/:id` para clientes
- Cancelar / confirmar / consumir reserva pelo dono
- Recorrência operacional; gateway real; webhook no browser
- BI / relatórios; calendário mensal pesado
- Edição/deleção de spaces ou slots; criação em lote de slots
- Alterações em `/api`

## Áreas refinadas

| Área            | Melhorias                                                                |
| --------------- | ------------------------------------------------------------------------ |
| Hub             | Passos do fluxo; Minhas arenas principal; abrir por ID secundário        |
| Minhas arenas   | Busca com botão; contador `meta.total`; cards e empty/error padronizados |
| Arena (detalhe) | Status badge; CTAs operacionais; navegação contextual                    |
| Espaços         | Formulário completo (descrição, capacidade, status); empty orientado     |
| Slots           | Copy sobre disponíveis vs reservas; sucesso/erro; badges; paginação      |
| Reservas        | Filtros client-side data/status; ordenação por horário; cards completos  |
| Agenda          | Lista cronológica do dia; CTAs para reservas e espaços                   |
| Detalhe reserva | Somente leitura; financeiro em `dl`; aviso de ações futuras              |

## Limitações mantidas

- `GET /arenas/:arenaId/reservations` sem paginação/filtros no servidor — filtros no client
- Sem ações de dono sobre reservas até a API expor rotas
- Recorrência oculta no detalhe da reserva (sprint futura)
- Horários por espaço (`GET /spaces/:spaceId/slots`), não rota agregada da arena na UI

## Decisões de UX

- **Navegação:** pills horizontais com `overflow-x-auto`; item ativo por pathname
- **Horários:** aba ativa em rotas `/slots`; link leva a Espaços para escolher o espaço
- **Estados:** reutilizar `EmptyState`, `ErrorState`, `CardsSkeleton` de `section-state`
- **Slot overlap:** mensagem via `getApiErrorMessage` (`SLOT_OVERLAP`)

## Arquivos principais

- `src/features/owner/components/owner-arena-navigation.tsx`
- `src/features/owner/components/owner-hub.tsx`
- `src/features/owner-arenas/components/owner-*-status-badge.tsx`
- `src/features/owner-arenas/components/owner-arena-*.tsx`
- `src/features/owner-arenas/components/owner-space-slots-view.tsx`
- `src/features/owner/utils.ts` (`sortReservationsBySlotStart`)

## Critérios de aceite

- [ ] `pnpm lint` e `pnpm build` passam
- [ ] Nenhum arquivo em `/api` alterado
- [ ] Painel owner separado do admin
- [ ] Navegação contextual em telas de arena
- [ ] Filtros client-side em reservas e agenda
- [ ] Detalhe de reserva somente leitura, sem pagar/cancelar
- [ ] Mobile sem overflow horizontal relevante

## Próximos passos

- Operações do dono sobre reservas (quando API permitir)
- Contadores opcionais no hub (via `meta` da listagem)
- Debounce na busca de arenas
