# Sprint 19 — Homologação real de pagamentos e integração ponta a ponta

## Objetivo

Validar o frontend contra o backend com **Pix/Asaas real**, polling, webhook no servidor e atualização das telas dependentes — com correções pequenas, documentação de achados e checklist QA atualizado. Sem features grandes.

## Ambiente usado (referência)

| Camada   | Configuração                                                                 |
| -------- | ---------------------------------------------------------------------------- |
| Backend  | `PAYMENTS_PROVIDER=asaas`, credenciais Asaas, `PORT=3000`                    |
| Webhook  | URL pública (ngrok/túnel) → `POST /payments/webhook` e reservas conforme API |
| Frontend | `NEXT_PUBLIC_API_URL` = URL alcançável pelo browser                          |
| Frontend | `NEXT_PUBLIC_PAYMENTS_PROVIDER=asaas`                                        |
| Seed     | `npm run db:seed:dev` em `/api` — `user1`, `org1`, `arena1`                  |

## Pré-requisitos

1. API e front rodando; CORS com origem do front.
2. Body do POST de pagamento: `{ "method": "PIX", "provider": "mock-provider" }` (único valor aceito pela API; gateway real via env do servidor).
3. Participante com evento **PAID** publicado e arena com pagamento > 0 no seed.
4. Dois browsers ou abas para testar organizador/dono enquanto participante paga (atualização cross-sessão depende de refetch ao focar aba).

## Fluxos testados (roteiro)

### 1. Catálogo público (`/arenas`)

- `GET /arenas` com `q`, cidade/UF/bairro, paginação.
- Detalhe `GET /arenas/:id`, espaços, slots.
- Filtros aplicam só ao clicar **Aplicar filtros** (sem request a cada tecla).

### 2. Reserva + Pix real

- Slot → reserva → `/account/reservations/[id]/payment` → **Pagar com Pix**.
- QR + copia-e-cola; polling `GET /payments/:id` até terminal.
- Após webhook: reserva, lista de reservas e pagamentos atualizam no participante.

### 3. Evento pago + Pix real

- Booking → `/checkout/[bookingId]` → **Pagar com Pix** → polling → `PAID`.
- Booking e pagamentos na conta; detalhe do pagamento com estado terminal.

### 4. Operação do organizador

- `/account/events/[eventId]`: `GET .../summary`, `.../bookings`, `.../payments`.
- Sem `/admin/*`; summary não calculado no cliente.
- Após pagamento do participante: ao **voltar à aba** do detalhe do evento, painéis revalidam.

### 5. Painel do dono

- `GET /users/me/arenas`; reservas recebidas e agenda.
- Reserva paga por participante: dono vê ao focar aba / reabrir (outro browser).

### 6. Conta participante

- Listas e detalhes de pagamentos, bookings, reservas.
- Pix só em `PENDING` com `checkout`; CTAs de continuar pagamento só quando pendente.

## Resultados (revisão de código + critérios)

| Área                                       | Status                                  |
| ------------------------------------------ | --------------------------------------- |
| Contratos de pagamento (POST/GET)          | Alinhados à Sprint 18                   |
| Polling 4s / máx. 5 min / para em terminal | OK                                      |
| Sem webhook no browser                     | OK                                      |
| Read models 16–18                          | Sem desvio estrutural                   |
| Homologação manual Pix real                | Depende de ambiente Asaas + executor QA |

## Bugs encontrados e correções (Sprint 19)

| Achado                                                                        | Correção                                                                         |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Mensagem de timeout do polling citava webhook de dev na experiência principal | `getPaymentPollTimeoutMessage()` — copy real vs dev                              |
| Organizador/dono em outra aba não viam dados novos sem F5                     | `refetchOnWindowFocus` em summary/bookings/payments do evento e reservas do dono |
| Cache do dono/slots após pagamento de reserva                                 | `invalidatePaymentTerminalCaches` invalida `ownerArenasKeys` e `slotsKeys`       |
| Badge duplicado no detalhe do pagamento                                       | `PixCheckoutPanel` com `showHeader={false}` no detalhe                           |
| Build quebrado (variável `statusMessage`)                                     | Corrigido na Sprint 18 follow-up (`actionMessage`)                               |

## Pendências de backend

- Aceitar `provider: "asaas"` no body (opcional) para deixar contrato explícito no POST.
- Expor `eventId` em `GET /payments/:id` (opcional) para invalidação cirúrgica da operação do evento sem prefixo amplo.

## Pendências de frontend

- Atualização **em tempo real** do organizador/dono na mesma aba enquanto outro usuário paga (exigiria polling no painel ou WebSocket — fora do escopo).
- Cenários `FAILED` / `CANCELLED` / checkout expirado dependem de simulação no gateway ou seed.

## Arquivos alterados

- `src/features/payments/polling-config.ts`
- `src/features/payments/polling-messages.ts` (novo)
- `src/features/payments/invalidate-payment-caches.ts`
- `src/features/payments/components/pix-checkout-panel.tsx`
- `src/features/payments/components/payment-detail.tsx`
- `src/features/payments/components/checkout-payment-card.tsx`
- `src/features/payments/components/reservation-checkout-payment-card.tsx`
- `src/features/events/hooks.ts`
- `src/features/owner-arenas/hooks.ts`
- `docs/03-qa/mvp-operational-checklist.md`
- `README.md`, `.env.example` (se aplicável)
- `docs/01-sprints/sprint-19-real-integration-homologation.md` (este arquivo)

## Critérios de aceite

- [x] Correções pequenas aplicadas conforme achados acima
- [x] `pnpm lint` / `pnpm build` / `format:write`
- [x] Nenhum arquivo em `/api` alterado
- [x] Checklist QA com seção H-19 e pré-requisitos Pix real
- [ ] Homologação manual Pix real executada no ambiente Asaas (registrar na tabela “Registro de execução” do checklist)

## Próximos passos

1. Executar checklist H-19 e P/O/D com Asaas + ngrok; registrar data e branch.
2. Tratar `FAILED`/`CANCELLED` em homologação assim que houver cenário reproduzível.
3. Avaliar invalidação com `eventId` no pagamento quando a API expuser o campo.

## Fora de escopo

Alterações em `/api`, novos endpoints, refund, webhook no browser, cartão/boleto, redesign, reescrita de apiClient, features grandes.
