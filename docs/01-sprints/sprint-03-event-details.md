# Sprint 03 — Detalhe público do evento

## Objetivo

Implementar a página pública de detalhe do evento usando o contrato real `GET /events/:id`, mantendo o fluxo de participação apenas como preparação visual.

## Escopo

- Buscar detalhe de evento por `eventId`
- Usar `optionalAuth` automaticamente via token existente no client
- Suportar `privateCode` como query param quando informado
- Exibir loading skeleton, erro e estado de não encontrado
- Exibir dados reais do evento: título, descrição, tipo, visibilidade, status, origem, data, local, capacidade e preço
- Exibir CTA visual para participação futura
- Manter detalhe público sem exigir login

## Fora de escopo

- Booking
- Checkout ou pagamento
- Inscrição gratuita
- Reserva de arena
- Recorrência
- Módulo `/search`
- Cálculo de disponibilidade real no frontend

## Endpoint usado

| Método | Rota          | Auth                   | Uso                       |
| ------ | ------------- | ---------------------- | ------------------------- |
| GET    | `/events/:id` | Público + optionalAuth | Detalhe público do evento |

Query param opcional:

| Param         | Uso                                      |
| ------------- | ---------------------------------------- |
| `privateCode` | Acesso a evento privado quando aplicável |

## Arquivos criados / alterados

```
src/features/events/types.ts
src/features/events/api.ts
src/features/events/hooks.ts
src/features/events/components/event-details.tsx
src/features/events/components/event-details-skeleton.tsx
src/features/events/components/event-details-error.tsx
src/features/events/components/event-not-found-state.tsx
src/features/events/components/event-participation-cta.tsx
src/features/events/components/event-info-card.tsx
src/features/events/components/event-price-badge.tsx
src/features/events/components/event-date-location.tsx
src/app/(public)/events/[eventId]/page.tsx
```

## Decisões técnicas

| Decisão                                      | Motivo                                                          |
| -------------------------------------------- | --------------------------------------------------------------- |
| `useEvent(eventId)` com TanStack Query       | Mantém o padrão de dados da aplicação                           |
| `getEventById()` em `features/events/api.ts` | Nenhum componente chama API diretamente                         |
| CTA sem ação real                            | Booking e inscrição ficam para sprints futuras                  |
| Sem cálculo de vagas                         | O backend ainda não fornece disponibilidade real neste contrato |
| `privateCode` opcional na URL                | O contrato documenta esse acesso para eventos privados          |

## Critérios de aceite

- [x] `/events/[eventId]` consome `GET /events/:id`
- [x] Página renderiza evento real
- [x] Loading, erro e não encontrado tratados
- [x] Botão “Ver detalhes” dos cards aponta para `/events/{id}`
- [x] Detalhe é público e não exige login
- [x] Usuário deslogado vê CTA para login/cadastro
- [x] Usuário logado vê CTA preparatório, sem booking
- [x] Nenhum booking, checkout ou pagamento implementado
- [x] Nenhum `fetch` fora de `src/lib/api/client.ts`
- [x] Nenhum arquivo de `/api` alterado

## Próximos passos

1. Implementar inscrição gratuita com `POST /events/:eventId/participants/free`
2. Tratar eventos privados com formulário de `privateCode`
3. Preparar fluxo de booking pago em sprint posterior
