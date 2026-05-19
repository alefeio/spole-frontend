# Sprint 05 — Conta, reservas, pagamentos e notificações

## Objetivo

Transformar `/account` e `/dashboard` em áreas úteis para o usuário autenticado, exibindo dados reais de inscrições, reservas/bookings, pagamentos e notificações com experiência mobile-first.

## Escopo

- Central da conta em `/account`
- Dashboard com resumo rápido da conta
- Subrota `/account/bookings` para inscrições gratuitas e reservas pagas
- Subrota `/account/payments` para pagamentos do usuário
- Subrota `/account/notifications` para notificações
- Cancelamento de booking com confirmação, usando endpoint real
- Marcar notificação como lida, usando endpoint real
- Estados de loading, erro, vazio e sucesso
- Navegação autenticada com atalhos para as novas áreas

## Fora de escopo

- Checkout real
- Pagamento de reserva de arena
- Recorrência
- Admin avançado
- Módulo `/search`
- Edição de perfil (`PATCH /users/me` inexistente)
- WebSocket/realtime
- Alterações no backend

## Endpoints usados

| Método | Rota                      | Uso                                      |
| ------ | ------------------------- | ---------------------------------------- |
| GET    | `/users/me`               | Dados básicos da conta                   |
| GET    | `/users/me/participants`  | Inscrições gratuitas                     |
| GET    | `/users/me/bookings`      | Reservas/bookings paginados              |
| PATCH  | `/bookings/:id/cancel`    | Cancelar booking quando `RESERVED`       |
| GET    | `/users/me/payments`      | Pagamentos paginados                     |
| GET    | `/payments/:id`           | Base preparada para detalhe de pagamento |
| GET    | `/users/me/notifications` | Notificações paginadas                   |
| PATCH  | `/notifications/:id/read` | Marcar notificação como lida             |

## Fluxos implementados

### Conta

- Mostra nome, e-mail, perfil, status e ID do usuário.
- Exibe cards de resumo para inscrições, pagamentos e notificações.
- Mantém edição de perfil fora do escopo.

### Bookings e inscrições

- Inscrições gratuitas vêm de `/users/me/participants`.
- Reservas pagas vêm de `/users/me/bookings`.
- Bookings `RESERVED` podem ser cancelados via endpoint real com `ConfirmDialog`.

### Pagamentos

- Pagamentos são listados de `/users/me/payments`.
- Status, método, valores e datas são exibidos conforme retorno da API.
- Não há checkout real nesta sprint.

### Notificações

- Notificações são listadas de `/users/me/notifications`.
- Notificações não lidas podem ser marcadas como lidas com `PATCH /notifications/:id/read`.
- Não há polling agressivo ou WebSocket.

## Decisões técnicas

| Decisão                                   | Motivo                                     |
| ----------------------------------------- | ------------------------------------------ |
| Subrotas em `/account/*`                  | Mantém a conta como hub do usuário         |
| Cards em vez de tabelas                   | Melhor experiência mobile                  |
| `participants` separado de `bookings`     | Contratos e entidades reais são diferentes |
| `ConfirmDialog` antes de cancelar booking | Evita cancelamento acidental               |
| Paginação via URL nas subrotas            | Permite navegação e compartilhamento       |
| Sem cálculo de status crítico             | Status exibido vem direto da API           |

## Ajustes mobile realizados

- Cards em coluna única por padrão.
- Botões de ação com altura confortável para toque.
- IDs longos usam quebra de texto.
- Navegação autenticada aceita quebra em múltiplas linhas.
- Subrotas evitam tabelas e largura fixa.
- Grids progressivos só entram em `sm:`/`lg:`.

## Arquivos criados / alterados

```
src/app/(app)/dashboard/page.tsx
src/app/(app)/account/page.tsx
src/app/(app)/account/bookings/page.tsx
src/app/(app)/account/payments/page.tsx
src/app/(app)/account/notifications/page.tsx
src/components/feedback/confirm-dialog.tsx
src/components/feedback/section-state.tsx
src/components/pagination/pagination-controls.tsx
src/components/layout/app-layout.tsx
src/features/bookings/*
src/features/payments/*
src/features/notifications/*
src/features/participants/*
src/features/events/hooks.ts
src/lib/api/error-messages.ts
```

## Critérios de aceite

- [x] `/dashboard` exibe resumo útil para usuário logado
- [x] `/account` exibe dados reais de `GET /users/me`
- [x] Usuário visualiza inscrições e bookings com endpoints reais
- [x] Usuário visualiza pagamentos com endpoint real
- [x] Usuário visualiza notificações com endpoint real
- [x] Marcar notificação como lida usa endpoint real
- [x] Cancelar booking usa endpoint real e confirmação
- [x] Nenhum endpoint foi inventado
- [x] Nenhum checkout real foi criado
- [x] Nenhum pagamento de reserva de arena foi criado
- [x] Nenhum `fetch` fora de `src/lib/api/client.ts`
- [x] Nenhum arquivo de `/api` alterado
- [x] Áreas novas usam layout mobile-first

## Próximos passos

1. Criar detalhe de pagamento, se necessário.
2. Implementar pagamento mock de booking pago com `POST /bookings/:bookingId/payments`.
3. Melhorar cards usando dados enriquecidos de evento caso o backend exponha joins no futuro.
4. Adicionar preferências de notificação somente quando houver contrato.
