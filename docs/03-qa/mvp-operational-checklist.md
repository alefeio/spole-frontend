# Checklist operacional — MVP web Spolê

> Homologação **manual** do frontend (`/web`) contra a API em `/api`.  
> Senha padrão do seed: **`SpoleDev123!`** — ver [`/api/docs/02-dev-seed.md`](../../../api/docs/02-dev-seed.md).

## Pré-requisitos

### Comum (local ou homologação)

1. API rodando (`pnpm dev` em `/api`, porta **3000** por padrão).
2. Frontend rodando (`pnpm dev -- -p 3001` em `/web`, se a porta 3000 estiver ocupada pela API).
3. Seed aplicado: `npm run db:seed:dev` na pasta `/api` (senha **`SpoleDev123!`**).
4. Contas do seed disponíveis: participante `user1@spole.dev`, organizador `org1@spole.dev`, dono `arena1@spole.dev`, admin `admin@spole.dev` (admin opcional na H-19).

### Backend — homologação Pix real (H-19)

Marque antes de executar os fluxos A/B:

| Item | Verificação                                                                                           |
| ---- | ----------------------------------------------------------------------------------------------------- |
| B-01 | `PAYMENTS_PROVIDER=asaas` em `/api/.env`                                                              |
| B-02 | Credenciais Asaas configuradas (`ASAAS_API_KEY`, ambiente sandbox conforme doc da API)                |
| B-03 | API acessível na URL que o **navegador** usará (localhost ou túnel)                                   |
| B-04 | Túnel público ativo (ngrok, Cloudflare Tunnel, etc.) se o webhook Asaas precisar alcançar sua máquina |
| B-05 | Webhook Asaas **booking** → `POST https://<túnel>/payments/webhook`                                   |
| B-06 | Webhook Asaas **reserva** → `POST https://<túnel>/reservation-payments/webhook` (rota separada)       |
| B-07 | CORS da API permite a origem do front (ex.: `http://localhost:3001`)                                  |
| B-08 | Seed com **evento PAID** publicado e vagas disponíveis                                                |
| B-09 | Seed com **arena** com pagamento mínimo > 0 e slots `AVAILABLE`                                       |

### Frontend — homologação Pix real (H-19)

| Item | Verificação                                                                                                    |
| ---- | -------------------------------------------------------------------------------------------------------------- |
| F-01 | `web/.env.local` copiado de `.env.example`                                                                     |
| F-02 | `NEXT_PUBLIC_API_URL` = mesma origem que o browser alcança (ex.: URL do ngrok da API, **não** a porta do Next) |
| F-03 | `NEXT_PUBLIC_PAYMENTS_PROVIDER=asaas` (sem mock como experiência principal)                                    |
| F-04 | Front abre sem erro de CORS / `Failed to fetch`                                                                |
| F-05 | `pnpm lint` e `pnpm build` passam (validação técnica prévia)                                                   |

### Pix mock (somente dev — fora da H-19 principal)

- `PAYMENTS_PROVIDER=mock` no backend + `NEXT_PUBLIC_PAYMENTS_PROVIDER=mock` no front.
- Disparar **webhook de teste no servidor** (não no navegador) — Sprint 09 / README da API.

Documentação: [Sprint 19](../01-sprints/sprint-19-real-integration-homologation.md) · [README do web](../../README.md).

## Como usar

| Coluna                 | Significado              |
| ---------------------- | ------------------------ |
| **Código**             | Identificador do cenário |
| **Papel**              | Perfil necessário        |
| **Conta**              | E-mail do seed           |
| **Rota inicial**       | URL no frontend          |
| **Passos**             | Sequência de ações       |
| **Resultado esperado** | Comportamento correto    |
| **Erro esperado**      | Quando aplicável         |
| **Seed**               | Dados ou IDs de apoio    |
| **Obs.**               | Notas                    |

Marque: `[ ]` pendente · `[x]` OK · `[!]` falha

---

## 1. Participante (`user`)

Conta padrão: **`user1@spole.dev`** (role `user`).

| Código | Papel        | Conta             | Rota inicial                           | Passos                                                                                        | Resultado esperado                                                                                  | Erro esperado                               | Seed / dados                                | Obs.                                                     |
| ------ | ------------ | ----------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- | -------------------------------------------------------- |
| P-01   | Participante | `user1@spole.dev` | `/events`                              | Abrir catálogo; usar busca/filtros se disponíveis                                             | Lista de eventos públicos publicados; paginação funciona                                            | —                                           | Termos: `futebol`, `corrida`                |                                                          |
| P-02   | Participante | —                 | `/events/[eventId]`                    | Abrir evento **público** publicado do catálogo                                                | Detalhe carrega título, data, CTA de participação                                                   | 404 se ID inválido                          | Evento público no seed                      |                                                          |
| P-03   | Participante | `user1@spole.dev` | `/events/[eventId]`                    | Em evento **FREE** publicado, clicar participar                                               | Mensagem de sucesso; inscrição registrada                                                           | `EVENT_FULL`, `ALREADY_REGISTERED`          | Evento gratuito com vagas                   |                                                          |
| P-04   | Participante | `user1@spole.dev` | `/events/[eventId]`                    | Em evento **PAID** publicado, reservar vaga                                                   | Redireciona para `/checkout/[bookingId]`                                                            | `EVENT_NOT_OPEN_FOR_BOOKING`                | Evento pago com vagas                       |                                                          |
| P-05   | Participante | `user1@spole.dev` | `/checkout/[bookingId]`                | Clicar **Pagar com Pix**; ver QR e/ou copia-e-cola; copiar código                             | POST retorna `checkout`; polling `PENDING`; UI sem label “mock”                                     | `BOOKING_NOT_PAYABLE`, `BOOKING_EXPIRED`    | Booking `RESERVED`; Sprint 18               |                                                          |
| P-06   | Participante | `user1@spole.dev` | checkout + backend                     | **Real:** pagar Pix no banco; webhook Asaas no servidor. **Dev:** webhook mock no servidor    | Pagamento → `PAID`; booking completa; UI mostra confirmado                                          | Timeout após 5 min sem confirmação          | Não chamar webhook no browser               | Sprint 19                                                |
| P-18   | Participante | `user1@spole.dev` | `/account/reservations/[id]/payment`   | **Pagar com Pix**; QR/copia-e-cola; polling                                                   | Mesmo padrão do checkout de evento                                                                  | `RESERVATION_NOT_PAYABLE`                   | Arena com pagamento > 0                     | Sprint 18                                                |
| P-19   | Participante | `user1@spole.dev` | `/account/payments/[id]`               | Abrir pagamento `PENDING`                                                                     | `PixCheckoutPanel` visível; some após `PAID`                                                        | —                                           | —                                           | Sprint 18                                                |
| P-07   | Participante | `user1@spole.dev` | `/account/payments/[paymentId]`        | Abrir pagamento após confirmação                                                              | Status terminal exibido conforme API                                                                | —                                           | —                                           |                                                          |
| P-08   | Participante | —                 | `/events/[id]?privateCode=CORRETO`     | Abrir URL com código válido                                                                   | Detalhe do evento privado visível                                                                   | —                                           | Evento privado no seed (código na doc seed) |                                                          |
| P-09   | Participante | —                 | `/events/[id]?privateCode=ERRADO`      | Código inválido ou gate com código errado                                                     | Acesso negado / mensagem de código inválido                                                         | 403 `FORBIDDEN`                             | —                                           |                                                          |
| P-10   | Participante | —                 | `/events/[id]?privateCode=…` deslogado | Clicar “Entrar para participar” → login                                                       | Após login, volta para `/events/[id]?privateCode=…`                                                 | —                                           | —                                           | Sprint 15: query preservada                              |
| P-11   | Participante | —                 | `/arenas`                              | Preencher nome/cidade/UF/bairro; **Aplicar filtros**; paginar; **Limpar filtros**; abrir card | Lista filtra ao aplicar (não a cada tecla); URL sincroniza; limpar reseta campos; card abre detalhe | 404 arena inexistente                       | Seed com arenas ACTIVE                      | Usa `GET /arenas`; filtros via botão Aplicar (Sprint 17) |
| P-12   | Participante | `user1@spole.dev` | `/arenas/…/spaces/[spaceId]`           | Escolher data; selecionar slot; reservar                                                      | Redireciona para `/account/reservations/[id]`                                                       | `SLOT_UNAVAILABLE`, `MIN_ADVANCE_VIOLATION` | Slot `AVAILABLE`                            |                                                          |
| P-13   | Participante | `user1@spole.dev` | `/account/reservations/[id]`           | Se `PENDING` e pagamento > 0, ir a pagamento                                                  | Checkout Pix em `/payment`; polling até terminal                                                    | `RESERVATION_NOT_PAYABLE`                   | Arena com % mínimo > 0                      | Sprint 18                                                |
| P-14   | Participante | `user1@spole.dev` | detalhe reserva                        | Arena com % mínimo **0**                                                                      | Pode nascer `CONFIRMED` sem CTA pagar                                                               | —                                           | Segunda arena no seed                       | Status só da API                                         |
| P-15   | Participante | `user1@spole.dev` | `/account/reservations/[id]`           | Cancelar quando `PENDING` ou `CONFIRMED`                                                      | Status `CANCELLED` na API                                                                           | `RESERVATION_ALREADY_CONSUMED`              | —                                           |                                                          |
| P-16   | Participante | `user1@spole.dev` | `/account/notifications`               | Abrir lista                                                                                   | Notificações carregam                                                                               | —                                           | `user1` com notificações                    |                                                          |
| P-17   | Participante | `user1@spole.dev` | notificações                           | Marcar como lida                                                                              | Item atualiza; lista revalida                                                                       | —                                           | —                                           |                                                          |

---

## 2. Organizador (`org`)

Conta padrão: **`org1@spole.dev`**.

| Código | Papel       | Conta               | Rota inicial                 | Passos                                                                  | Resultado esperado                                                         | Erro esperado                  | Seed / dados                            | Obs. |
| ------ | ----------- | ------------------- | ---------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------ | --------------------------------------- | ---- |
| O-01   | Organizador | `org1@spole.dev`    | `/account/events`            | Abrir listagem                                                          | Eventos do organizador com filtros/paginação                               | —                              | —                                       |      |
| O-02   | Organizador | `org1@spole.dev`    | `/account/events/new`        | Criar `FREE_LOCATION` como **DRAFT**                                    | Evento criado; aparece na lista                                            | `VALIDATION_ERROR`             | —                                       |      |
| O-03   | Organizador | `org1@spole.dev`    | detalhe evento               | Publicar rascunho                                                       | Status `PUBLISHED`                                                         | —                              | —                                       |      |
| O-04   | Organizador | `org1@spole.dev`    | `/account/events/new`        | Criar evento **PRIVATE** com código                                     | `privateCode` no detalhe                                                   | —                              | —                                       |      |
| O-05   | Organizador | detalhe             | Copiar link privado          | URL contém `privateCode`                                                | —                                                                          | —                              | Só no detalhe                           |
| O-06   | Organizador | detalhe             | Editar campos permitidos     | Salvar                                                                  | Dados atualizados                                                          | `EVENT_CANCELLED` se cancelado | —                                       |      |
| O-07   | Organizador | detalhe             | Cancelar com confirmação     | Status `CANCELLED`                                                      | —                                                                          | —                              |                                         |
| O-08   | Organizador | `org1@spole.dev`    | `/account/reservations/[id]` | Reserva **CONFIRMED** → criar evento arena                              | Form com local somente leitura                                             | `RESERVATION_INVALID_STATE`    | Reserva confirmada seed                 |      |
| O-09   | Organizador | editar evento arena | Tentar alterar endereço/data | Campos bloqueados                                                       | `locationReadOnly` respeitado                                              | —                              | —                                       |      |
| O-10   | Organizador | detalhe FREE        | Abrir painel participantes   | Lista de inscritos                                                      | —                                                                          | Evento gratuito                |                                         |
| O-11   | Organizador | `org1@spole.dev`    | detalhe evento PAID          | Ver resumo, bookings e pagamentos                                       | Painéis carregam via API do evento                                         | 403 se não for dono            | Não usar rotas `/admin/*`               |
| O-12   | Organizador | `org1@spole.dev`    | detalhe evento PAID          | Após P-06 (Pix real ou mock), voltar à aba do detalhe ou reabrir evento | Summary, bookings e pagamentos refletem o pagamento (refetch ao focar aba) | —                              | Sprint 17 + 19 (`refetchOnWindowFocus`) |

---

## 3. Admin (`admin`)

Conta: **`admin@spole.dev`**.  
Conta negativa: **`user1@spole.dev`** para testes de bloqueio.

| Código | Papel | Conta             | Rota inicial          | Passos                                  | Resultado esperado                                  | Erro esperado                               | Seed / dados                | Obs. |
| ------ | ----- | ----------------- | --------------------- | --------------------------------------- | --------------------------------------------------- | ------------------------------------------- | --------------------------- | ---- |
| A-01   | User  | `user1@spole.dev` | `/admin`              | Tentar acessar                          | `AccessDenied`                                      | —                                           | —                           |      |
| A-02   | Admin | `admin@spole.dev` | `/admin`              | Abrir hub                               | Totais / links operacionais                         | —                                           | —                           |      |
| A-03   | Admin | `admin@spole.dev` | `/admin/users`        | Listar; filtrar; página 2               | Paginação e filtros OK                              | —                                           | `user4`–`user6` para volume |      |
| A-04   | Admin | `admin@spole.dev` | detalhe usuário       | Alterar status com **motivo**           | Status atualiza; audit                              | `ADMIN_CANNOT_MODIFY_SELF` no próprio admin | —                           |      |
| A-05   | Admin | `admin@spole.dev` | `/admin/events`       | Listar; cancelar evento com motivo      | Lista revalida                                      | —                                           | —                           |      |
| A-06   | Admin | `admin@spole.dev` | `/admin/reservations` | Listar reservas                         | Lista carrega                                       | —                                           | —                           |      |
| A-07   | Admin | `admin@spole.dev` | `/admin/payments`     | Listar pagamentos                       | Lista carrega                                       | —                                           | —                           |      |
| A-08   | Admin | `admin@spole.dev` | `/admin/arenas`       | Listar; alterar status arena com motivo | Revalidação                                         | `INVALID_STATUS_TRANSITION`                 | —                           |      |
| A-09   | Admin | `admin@spole.dev` | `/admin/bookings`     | Listar bookings                         | Lista carrega                                       | —                                           | —                           |      |
| A-10   | Admin | `admin@spole.dev` | `/admin/audit`        | Listar auditoria                        | Logs legíveis                                       | —                                           | Seed com audit              |      |
| A-11   | Admin | `admin@spole.dev` | qualquer lista        | Provocar erro 5xx/429 (opcional)        | Mensagem PT + código de referência quando aplicável | `RATE_LIMIT_EXCEEDED`                       | —                           |      |

---

## 4. Dono de arena (`arena_owner`)

Conta: **`arena1@spole.dev`**.  
Conta negativa: **`user1@spole.dev`**.

| Código | Papel | Conta              | Rota inicial              | Passos                             | Resultado esperado                                | Erro esperado          | Seed / dados                  | Obs.      |
| ------ | ----- | ------------------ | ------------------------- | ---------------------------------- | ------------------------------------------------- | ---------------------- | ----------------------------- | --------- |
| D-01   | User  | `user1@spole.dev`  | `/owner`                  | Tentar acessar                     | `AccessDenied`                                    | —                      | —                             |           |
| D-02   | Dono  | `arena1@spole.dev` | `/owner`                  | Abrir hub                          | Links para minhas arenas                          | —                      | —                             |           |
| D-03   | Dono  | `arena1@spole.dev` | `/owner/arenas`           | Listar; filtrar; paginar           | `GET /users/me/arenas`                            | —                      | —                             |           |
| D-04   | Dono  | `arena1@spole.dev` | `/owner/arenas/new`       | Criar arena                        | Lista revalida                                    | `ARENA_SLUG_CONFLICT`  | —                             |           |
| D-05   | Dono  | `arena1@spole.dev` | `…/edit`                  | Editar arena                       | Detalhe e lista atualizam                         | —                      | —                             |           |
| D-06   | Dono  | `arena1@spole.dev` | `…/spaces`                | Criar espaço                       | Lista de espaços atualiza                         | —                      | —                             |           |
| D-07   | Dono  | `arena1@spole.dev` | `…/spaces/[id]/slots`     | Criar slot unitário                | Lista do dia atualiza; sucesso                    | `SLOT_OVERLAP` + ajuda | —                             |           |
| D-08   | Dono  | `arena1@spole.dev` | slots                     | Criar slot que cruza existente     | Erro claro em PT                                  | `SLOT_OVERLAP`         | —                             |           |
| D-09   | Dono  | `arena1@spole.dev` | `…/reservations`          | Filtrar data/status                | Filtro **client-side**; aviso visível             | —                      | —                             |           |
| D-10   | Dono  | `arena1@spole.dev` | `…/reservations/[id]`     | Abrir detalhe somente leitura      | Sem ações de cancelar/consumir                    | —                      | —                             |           |
| D-11   | Dono  | `arena1@spole.dev` | `…/agenda?date=`          | Navegar dias; ver reservas do dia  | Só reservas; copy vs horários disponíveis         | —                      | —                             |           |
| D-12   | Dono  | `arena1@spole.dev` | slots / agenda / reservas | Seguir links cruzados              | Navegação coerente entre módulos                  | —                      | —                             | Sprint 14 |
| D-13   | Dono  | `arena1@spole.dev` | `…/reservations`          | Após P-18/P-06 em reserva da arena | Reserva paga aparece ao focar aba / reabrir lista | —                      | Participante em outro browser | Sprint 19 |

---

## 5. Homologação Pix real (H-19)

> **Objetivo:** executar homologação ponta a ponta com Asaas/sandbox + webhook no servidor.  
> **Não** chamar webhook no browser · **não** marcar pagamento como pago no front.

### 5.1 Matriz de cenários

Marque cada linha após o teste. Referência cruzada: P-04…P-19, O-12, D-13.

| Código  | Cenário                   | Como validar                                    | Resultado esperado                                                                           |
| ------- | ------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| H-19-1  | Pix real — evento pago    | Fluxo A                                         | Checkout gera Pix; status terminal via API                                                   |
| H-19-2  | Pix real — reserva arena  | Fluxo B                                         | Idem na rota de reserva                                                                      |
| H-19-3  | QR Code Pix               | Fluxo A ou B, após **Pagar com Pix**            | Imagem QR visível quando `checkout.pixQrCode` vier preenchido                                |
| H-19-4  | Copia-e-cola Pix          | Fluxo A ou B                                    | Campo/código visível quando `checkout.pixCopyPaste` existir                                  |
| H-19-5  | Copiar código Pix         | Clicar **Copiar código Pix**                    | Feedback “Código Pix copiado” (ou fallback manual documentado)                               |
| H-19-6  | Polling                   | Durante `PENDING`                               | Requisições periódicas a `GET /payments/:id` (≈4s); param em terminal                        |
| H-19-7  | Status `PAID`             | Após pagar no sandbox + webhook                 | UI: “Pagamento confirmado”; polling para                                                     |
| H-19-8  | Status `FAILED`           | Fluxo C (se reproduzível)                       | UI: “Pagamento não aprovado”; polling para                                                   |
| H-19-9  | Status `CANCELLED`        | Fluxo C (se reproduzível)                       | UI: “Pagamento cancelado”; polling para                                                      |
| H-19-10 | Checkout expirado         | Aguardar `paymentExpiresAt` / TTL (se possível) | Sem Pix ativo; mensagem coerente; sem polling infinito                                       |
| H-19-11 | Organizador — operação    | Fluxo A, passo organizador                      | `GET /events/:id/summary`, `.../bookings`, `.../payments` atualizados (refetch ao focar aba) |
| H-19-12 | Dono — reservas/agenda    | Fluxo B, passo dono                             | Reserva paga em `/owner/.../reservations` e `/agenda`                                        |
| H-19-13 | Participante — conta      | Após A ou B                                     | `/account/payments`, `/account/bookings` ou `/account/reservations` coerentes                |
| H-19-14 | Mobile checkout Pix       | Fluxo A ou B em viewport estreita (~375px)      | Botões `min-h-11`; QR/copia-e-cola usáveis; sem overflow horizontal                          |
| H-19-15 | Catálogo arenas (suporte) | P-11                                            | `GET /arenas`; filtros com **Aplicar**                                                       |
| H-19-16 | Mock não é principal      | `NEXT_PUBLIC_PAYMENTS_PROVIDER=mock`            | Só aviso de dev; não usar na rodada H-19 oficial                                             |

### 5.2 Fluxo A — Evento pago (roteiro)

1. Login **`user1@spole.dev`**.
2. Abrir evento **PAID** publicado (`/events/[eventId]`).
3. Reservar vaga → redireciona para `/checkout/[bookingId]`.
4. Clicar **Pagar com Pix** → conferir **H-19-3**, **H-19-4**, **H-19-5**.
5. Pagar no app/sandbox Asaas (valor do Pix gerado).
6. Confirmar webhook no servidor (logs Asaas/ngrok) — **não** no browser.
7. Aguardar na tela: polling (**H-19-6**) até **H-19-7** (`PAID`).
8. Abrir `/account/payments/[paymentId]` → Pix some; status terminal (**H-19-13**).
9. Abrir `/account/bookings` → booking reflete confirmação.
10. Logout → login **`org1@spole.dev`**.
11. Abrir `/account/events/[eventId]` do evento pago.
12. Conferir summary, bookings e pagamentos (**H-19-11**) — voltar à aba ou reabrir se estava aberta durante o pagamento.

### 5.3 Fluxo B — Reserva de arena paga (roteiro)

1. Login **`user1@spole.dev`**.
2. `/arenas` → buscar/filtrar arena (**H-19-15** opcional) → abrir arena → espaço.
3. Escolher data/slot **AVAILABLE** → criar reserva.
4. Ir para `/account/reservations/[reservationId]/payment` (ou CTA no detalhe).
5. **Pagar com Pix** → **H-19-3** a **H-19-5**.
6. Pagar no sandbox Asaas; aguardar webhook em `/reservation-payments/webhook`.
7. Polling até **H-19-7**.
8. `/account/reservations` e `/account/payments` (**H-19-13**).
9. Logout → login **`arena1@spole.dev`**.
10. `/owner/arenas` → arena da reserva → **reservations** e **agenda** (**H-19-12**).

### 5.4 Fluxo C — Falha / cancelamento (roteiro)

> Depende do suporte do backend/Asaas sandbox (webhook com `FAILED`/`CANCELLED` ou expiração).

1. Repetir início do Fluxo A ou B até gerar pagamento `PENDING`.
2. Provocar `FAILED` ou `CANCELLED` conforme doc `/api/docs/02-features/payments.md` (não simular no front).
3. Confirmar mensagens **H-19-8** / **H-19-9** e que polling parou.
4. Em detalhe/lista: **sem** botão **Copiar código Pix** nem QR em status terminal.
5. Se possível, testar expiração do checkout (**H-19-10**).

### 5.5 Evidências sugeridas (opcional)

- Print da tela com QR + copia-e-cola (`PENDING`).
- Print do status `PAID` no front.
- Trecho de log do ngrok (webhook 200) ou painel Asaas.
- `paymentId` e `X-Request-Id` em caso de falha.

---

## 6. Cross-cutting (todos os papéis)

| Código | Verificação                                        | Resultado esperado                |
| ------ | -------------------------------------------------- | --------------------------------- |
| X-01   | `pnpm lint` e `pnpm build` em `/web`               | Passam                            |
| X-02   | Sem `console.log` em `web/src`                     | Ausente                           |
| X-03   | 401 com token inválido                             | Redireciona login; token removido |
| X-04   | Menu: `user` sem Admin nem Painel arena            | OK                                |
| X-05   | Menu: `arena_owner` vê Painel arena                | OK                                |
| X-06   | Menu: `admin` vê Admin                             | OK                                |
| X-07   | Mobile: sem overflow horizontal nas rotas críticas | OK                                |
| X-08   | Mutations sensíveis: botão disabled durante envio  | OK                                |

---

## Registro de execução (rodada)

| Data | Executor | Ambiente (API URL · Web URL · túnel) | Branch / commit | Pré-requisitos B-01…F-05 |
| ---- | -------- | ------------------------------------ | --------------- | ------------------------ |
|      |          |                                      |                 | [ ] OK · [ ] Parcial     |

## Registro de achados (H-19)

Preencha **uma linha por cenário testado**. Não invente resultado — use `Pendente` até executar.

| Data/hora | Ambiente | Conta | Cenário (ex. H-19-7) | Resultado | Evidência / observação | Status                             | Tipo                                                 | Próxima ação |
| --------- | -------- | ----- | -------------------- | --------- | ---------------------- | ---------------------------------- | ---------------------------------------------------- | ------------ |
|           |          |       |                      |           |                        | OK · Falhou · Bloqueado · Pendente | frontend · backend · ambiente · Asaas · documentação |              |

**Status:** `OK` passou · `Falhou` bug reproduzido · `Bloqueado` dependência externa · `Pendente` não executado.

**Tipo:** onde investigar primeiro.

**Exemplos de próxima ação (não preencher como resultado):** ajustar `NEXT_PUBLIC_API_URL`; conferir webhook no ngrok; abrir issue no front; escalar para API/Asaas.
