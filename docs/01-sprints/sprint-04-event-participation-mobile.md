# Sprint 04 — Participação em evento e revisão mobile

## Objetivo

Implementar o fluxo inicial de participação em evento usando apenas endpoints reais do backend e revisar as telas principais para uma experiência mobile-first.

## Escopo

- Inscrição em evento gratuito para usuário autenticado
- Reserva temporária em evento pago para usuário autenticado
- CTA de participação com estados de loading, sucesso, erro, deslogado e indisponível
- Invalidação de cache do detalhe/listagem de eventos após participação/reserva
- Estrutura mínima da feature `bookings`
- Ajustes mobile em headers, home, catálogo, detalhe, login, cadastro, dashboard e conta

## Fora de escopo

- Pagamento de reserva de arena
- Recorrência
- Admin avançado
- Módulo `/search`
- Edição de perfil
- Listagem completa de reservas de arena
- Checkout real
- Pagamento mock de evento pago nesta sprint
- Alterações no backend

## Endpoints usados

| Método | Rota                                 | Uso                                 |
| ------ | ------------------------------------ | ----------------------------------- |
| POST   | `/events/:eventId/participants/free` | Inscrição em evento gratuito        |
| POST   | `/events/:eventId/bookings`          | Reserva temporária para evento pago |
| GET    | `/events/:id`                        | Revalidação do detalhe após ação    |

## Fluxos implementados

### Evento gratuito

1. Usuário deslogado vê CTA para entrar ou criar conta.
2. Usuário logado aciona `POST /events/:eventId/participants/free`.
3. Durante envio, o botão fica desabilitado.
4. Em sucesso, o detalhe/listagem de eventos são revalidados.
5. Em erro, a mensagem do backend é traduzida para português claro.

### Evento pago

1. Usuário logado aciona `POST /events/:eventId/bookings`.
2. O backend cria uma reserva temporária (`RESERVED`) com `expiresAt`.
3. O frontend exibe a confirmação da reserva temporária.
4. Checkout/pagamento mock fica para uma sprint posterior.

## Decisões técnicas

| Decisão                                        | Motivo                                                    |
| ---------------------------------------------- | --------------------------------------------------------- |
| Inscrição gratuita em `features/events/api.ts` | O endpoint real está sob `/events/:id`                    |
| Feature `bookings` mínima                      | Preparar evento pago sem criar telas de bookings          |
| Sem pagamento nesta sprint                     | Evita checkout incompleto; reserva paga é etapa seguinte  |
| Sem cálculo de disponibilidade                 | O contrato não expõe disponibilidade real no detalhe      |
| CTA guarda estado local de sucesso/erro        | Fluxo simples e contextual no próprio detalhe             |
| Login com `redirect`                           | Usuário volta ao evento após autenticação quando possível |

## Ajustes mobile realizados

- Header público e autenticado agora quebram em múltiplas linhas no mobile.
- Home usa títulos e CTAs com tamanho adequado para telas pequenas.
- Formulários de login/cadastro usam inputs e botões com altura confortável para toque.
- Filtros do catálogo usam controles full-width no mobile.
- Detalhe do evento reduz título no mobile e evita overflow com `break-words`.
- Dados longos da conta usam quebra (`break-all`) quando necessário.
- CTAs principais usam `min-h-11` no mobile.

## Arquivos criados / alterados

```
src/features/events/api.ts
src/features/events/hooks.ts
src/features/events/types.ts
src/features/events/components/event-participation-cta.tsx
src/features/events/components/event-details.tsx
src/features/events/components/event-filters.tsx
src/features/events/components/event-search-input.tsx
src/features/bookings/api.ts
src/features/bookings/hooks.ts
src/features/bookings/types.ts
src/features/bookings/components/booking-hold-confirmation.tsx
src/lib/api/error-messages.ts
src/features/auth/hooks.ts
src/features/auth/components/login-form.tsx
src/features/auth/components/register-form.tsx
src/features/auth/components/logout-button.tsx
src/components/layout/public-layout.tsx
src/components/layout/public-auth-link.tsx
src/components/layout/app-layout.tsx
src/components/layout/auth-layout.tsx
src/components/ui/input.tsx
src/app/(public)/page.tsx
src/app/(app)/dashboard/page.tsx
src/app/(app)/account/page.tsx
```

## Critérios de aceite

- [x] Usuário deslogado não participa sem login
- [x] Usuário logado participa de evento gratuito via endpoint real
- [x] Evento pago cria booking temporário via endpoint real
- [x] Erros do backend aparecem em português claro
- [x] Botão de participação impede duplo clique durante envio
- [x] Cache do detalhe/listagem de eventos é revalidado após ação
- [x] Nenhum endpoint foi inventado
- [x] Nenhum `fetch` fora de `src/lib/api/client.ts`
- [x] Nenhum arquivo de `/api` alterado
- [x] Telas principais revisadas para mobile
- [x] Booking, checkout e pagamento completo não foram implementados

## Próximos passos

1. Implementar pagamento mock para booking pago com `POST /bookings/:bookingId/payments`
2. Criar acompanhamento de pagamento em `/payments/:id`
3. Listar minhas inscrições e reservas em área autenticada
4. Melhorar fluxo de evento privado com entrada explícita de `privateCode`
