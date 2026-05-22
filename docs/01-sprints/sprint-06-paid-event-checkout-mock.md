# Sprint 06 — Checkout mock para evento pago

## Objetivo

Implementar o fluxo de checkout mock para reservas temporárias de eventos pagos, usando apenas os endpoints reais documentados do backend.

## Escopo

- Rota autenticada `/checkout/[bookingId]`
- Resumo da reserva temporária usando dados de `/users/me/bookings`
- Criação de pagamento pendente com `POST /bookings/:bookingId/payments`
- Exibição do pagamento retornado pela API
- CTA “Continuar pagamento” em bookings `RESERVED`
- Redirecionamento do CTA de evento pago para o checkout após criar booking
- Revalidação de cache de bookings, payments e detalhe/listagem de eventos

## Fora de escopo

- Gateway real de pagamento
- Webhook no frontend
- Simular aprovação/recusa no browser
- Pagamento de reserva de arena
- Recorrência
- Admin avançado
- Módulo `/search`
- Edição de perfil
- Alterações no backend

## Endpoints usados

| Método | Rota                            | Uso                                         |
| ------ | ------------------------------- | ------------------------------------------- |
| GET    | `/users/me/bookings`            | Localizar booking do usuário autenticado    |
| POST   | `/bookings/:bookingId/payments` | Criar pagamento mock pendente               |
| GET    | `/payments/:id`                 | Base já existente para detalhe de pagamento |
| GET    | `/users/me/payments`            | Listar pagamentos reais na conta            |

## Fluxo implementado

1. Usuário cria booking pago em `/events/[eventId]` com `POST /events/:eventId/bookings`.
2. Após sucesso, o frontend redireciona para `/checkout/[bookingId]`.
3. A tela carrega a lista de bookings do usuário e localiza o booking pelo ID.
4. Se o booking estiver `RESERVED`, exibe ação para criar pagamento mock.
5. O pagamento é criado com:

```json
{
  "method": "PIX",
  "provider": "mock-provider"
}
```

6. O pagamento retornado é exibido com status real do backend.

## Decisões técnicas

| Decisão                                             | Motivo                                                   |
| --------------------------------------------------- | -------------------------------------------------------- |
| `/checkout/[bookingId]` dentro do grupo autenticado | Garante AuthGuard existente                              |
| Buscar booking via `/users/me/bookings`             | Não existe `GET /bookings/:id` documentado               |
| Não chamar webhook pelo browser                     | Webhook exige segredo e é integração servidor/fornecedor |
| Não simular status manualmente                      | Status crítico vem do backend                            |
| Pagamento fixo `PIX` + `mock-provider`              | Únicos valores aceitos no contrato atual                 |

## Tratamento de evento pago

- Evento pago cria booking real.
- Booking `RESERVED` pode seguir para checkout.
- Booking expirado/cancelado/concluído exibe status real e bloqueia criação de novo pagamento naquela tela.

## Tratamento de status

- `Booking.status` vem da API.
- `Payment.status` vem da API.
- `PENDING` é exibido como pendente.
- Aprovação/recusa depende do backend/webhook, não do frontend.

## Ajustes mobile realizados

- Checkout em coluna única no mobile.
- Cards sem tabela.
- Botões com `min-h-11` no mobile.
- IDs longos com quebra de texto.
- Layout progride para grid em telas grandes.

## Arquivos criados / alterados

```
src/app/(app)/checkout/[bookingId]/page.tsx
src/features/payments/api.ts
src/features/payments/hooks.ts
src/features/payments/types.ts
src/features/payments/components/checkout-payment-card.tsx
src/features/payments/components/payment-card.tsx
src/features/bookings/components/checkout-booking-summary.tsx
src/features/bookings/components/booking-card.tsx
src/features/bookings/components/booking-hold-confirmation.tsx
src/features/events/components/event-participation-cta.tsx
src/lib/api/error-messages.ts
```

## Critérios de aceite

- [x] Usuário deslogado é direcionado para login antes do checkout pelo AuthGuard
- [x] Usuário logado cria booking de evento pago usando endpoint real
- [x] Usuário acessa `/checkout/[bookingId]`
- [x] Usuário cria pagamento pendente usando endpoint real
- [x] Status de booking/payment vem do backend
- [x] Cache de bookings, payments e eventos é revalidado após mutations
- [x] `/account/bookings` mostra CTA para continuar pagamento em booking `RESERVED`
- [x] `/account/payments` mostra pagamentos reais e status reais
- [x] Nenhum endpoint foi inventado
- [x] Nenhum gateway real foi criado
- [x] Nenhum pagamento de reserva de arena foi criado
- [x] Nenhum `fetch` fora de `src/lib/api/client.ts`
- [x] Nenhum arquivo de `/api` alterado

## Pendências identificadas

- Não há endpoint documentado para simular aprovação/recusa pelo frontend.
- Não há `GET /bookings/:id`; o checkout localiza o booking dentro de `/users/me/bookings`.
- Confirmação de pagamento ocorre via webhook do backend, fora do browser.

## Próximos passos

1. Criar tela de detalhe de pagamento se necessário.
2. Melhorar checkout quando o backend expor consulta direta de booking.
3. Integrar status aprovado/recusado após fluxo operacional de webhook.
