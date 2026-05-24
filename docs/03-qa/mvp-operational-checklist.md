# Checklist operacional — MVP web Spolê

> Homologação **manual** do frontend (`/web`) contra a API em `/api`.  
> Senha padrão do seed: **`SpoleDev123!`** — ver [`/api/docs/02-dev-seed.md`](../../../api/docs/02-dev-seed.md).

## Pré-requisitos

1. API rodando (`pnpm dev` em `/api`, porta **3000**).
2. Frontend rodando (`pnpm dev -- -p 3001` em `/web`, se necessário).
3. `NEXT_PUBLIC_API_URL=http://localhost:3000` em `web/.env.local`.
4. Seed aplicado: `npm run db:seed:dev` na pasta `/api`.
5. Para pagamentos mock: disparar **webhook de teste no backend** (não no navegador) — ver Sprint 09.

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

| Código | Papel        | Conta             | Rota inicial                           | Passos                                            | Resultado esperado                                       | Erro esperado                               | Seed / dados                                | Obs.                        |
| ------ | ------------ | ----------------- | -------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- | --------------------------- |
| P-01   | Participante | `user1@spole.dev` | `/events`                              | Abrir catálogo; usar busca/filtros se disponíveis | Lista de eventos públicos publicados; paginação funciona | —                                           | Termos: `futebol`, `corrida`                |                             |
| P-02   | Participante | —                 | `/events/[eventId]`                    | Abrir evento **público** publicado do catálogo    | Detalhe carrega título, data, CTA de participação        | 404 se ID inválido                          | Evento público no seed                      |                             |
| P-03   | Participante | `user1@spole.dev` | `/events/[eventId]`                    | Em evento **FREE** publicado, clicar participar   | Mensagem de sucesso; inscrição registrada                | `EVENT_FULL`, `ALREADY_REGISTERED`          | Evento gratuito com vagas                   |                             |
| P-04   | Participante | `user1@spole.dev` | `/events/[eventId]`                    | Em evento **PAID** publicado, reservar vaga       | Redireciona para `/checkout/[bookingId]`                 | `EVENT_NOT_OPEN_FOR_BOOKING`                | Evento pago com vagas                       |                             |
| P-05   | Participante | `user1@spole.dev` | `/checkout/[bookingId]`                | Revisar resumo; iniciar pagamento mock            | POST pagamento; polling `PENDING`                        | `BOOKING_NOT_PAYABLE`, `BOOKING_EXPIRED`    | Booking `RESERVED`                          |                             |
| P-06   | Participante | `user1@spole.dev` | checkout + API                         | Disparar webhook mock no **backend**              | Pagamento → `PAID`; booking completa quando API refletir | Timeout após 5 min sem webhook              | Ver Sprint 09 / README API                  |                             |
| P-07   | Participante | `user1@spole.dev` | `/account/payments/[paymentId]`        | Abrir pagamento após confirmação                  | Status terminal exibido conforme API                     | —                                           | —                                           |                             |
| P-08   | Participante | —                 | `/events/[id]?privateCode=CORRETO`     | Abrir URL com código válido                       | Detalhe do evento privado visível                        | —                                           | Evento privado no seed (código na doc seed) |                             |
| P-09   | Participante | —                 | `/events/[id]?privateCode=ERRADO`      | Código inválido ou gate com código errado         | Acesso negado / mensagem de código inválido              | 403 `FORBIDDEN`                             | —                                           |                             |
| P-10   | Participante | —                 | `/events/[id]?privateCode=…` deslogado | Clicar “Entrar para participar” → login           | Após login, volta para `/events/[id]?privateCode=…`      | —                                           | —                                           | Sprint 15: query preservada |
| P-11   | Participante | —                 | `/arenas`                              | Buscar por cidade/nome; abrir card                | Detalhe da arena                                         | 404 arena inexistente                       | Seed com arenas ACTIVE                      | Usa `GET /arenas`           |
| P-12   | Participante | `user1@spole.dev` | `/arenas/…/spaces/[spaceId]`           | Escolher data; selecionar slot; reservar          | Redireciona para `/account/reservations/[id]`            | `SLOT_UNAVAILABLE`, `MIN_ADVANCE_VIOLATION` | Slot `AVAILABLE`                            |                             |
| P-13   | Participante | `user1@spole.dev` | `/account/reservations/[id]`           | Se `PENDING` e pagamento > 0, pagar               | Checkout `/payment`; polling até terminal                | `RESERVATION_NOT_PAYABLE`                   | Arena com % mínimo > 0                      |                             |
| P-14   | Participante | `user1@spole.dev` | detalhe reserva                        | Arena com % mínimo **0**                          | Pode nascer `CONFIRMED` sem CTA pagar                    | —                                           | Segunda arena no seed                       | Status só da API            |
| P-15   | Participante | `user1@spole.dev` | `/account/reservations/[id]`           | Cancelar quando `PENDING` ou `CONFIRMED`          | Status `CANCELLED` na API                                | `RESERVATION_ALREADY_CONSUMED`              | —                                           |                             |
| P-16   | Participante | `user1@spole.dev` | `/account/notifications`               | Abrir lista                                       | Notificações carregam                                    | —                                           | `user1` com notificações                    |                             |
| P-17   | Participante | `user1@spole.dev` | notificações                           | Marcar como lida                                  | Item atualiza; lista revalida                            | —                                           | —                                           |                             |

---

## 2. Organizador (`org`)

Conta padrão: **`org1@spole.dev`**.

| Código | Papel       | Conta               | Rota inicial                 | Passos                                     | Resultado esperado                           | Erro esperado                  | Seed / dados              | Obs. |
| ------ | ----------- | ------------------- | ---------------------------- | ------------------------------------------ | -------------------------------------------- | ------------------------------ | ------------------------- | ---- |
| O-01   | Organizador | `org1@spole.dev`    | `/account/events`            | Abrir listagem                             | Eventos do organizador com filtros/paginação | —                              | —                         |      |
| O-02   | Organizador | `org1@spole.dev`    | `/account/events/new`        | Criar `FREE_LOCATION` como **DRAFT**       | Evento criado; aparece na lista              | `VALIDATION_ERROR`             | —                         |      |
| O-03   | Organizador | `org1@spole.dev`    | detalhe evento               | Publicar rascunho                          | Status `PUBLISHED`                           | —                              | —                         |      |
| O-04   | Organizador | `org1@spole.dev`    | `/account/events/new`        | Criar evento **PRIVATE** com código        | `privateCode` no detalhe                     | —                              | —                         |      |
| O-05   | Organizador | detalhe             | Copiar link privado          | URL contém `privateCode`                   | —                                            | —                              | Só no detalhe             |
| O-06   | Organizador | detalhe             | Editar campos permitidos     | Salvar                                     | Dados atualizados                            | `EVENT_CANCELLED` se cancelado | —                         |      |
| O-07   | Organizador | detalhe             | Cancelar com confirmação     | Status `CANCELLED`                         | —                                            | —                              |                           |
| O-08   | Organizador | `org1@spole.dev`    | `/account/reservations/[id]` | Reserva **CONFIRMED** → criar evento arena | Form com local somente leitura               | `RESERVATION_INVALID_STATE`    | Reserva confirmada seed   |      |
| O-09   | Organizador | editar evento arena | Tentar alterar endereço/data | Campos bloqueados                          | `locationReadOnly` respeitado                | —                              | —                         |      |
| O-10   | Organizador | detalhe FREE        | Abrir painel participantes   | Lista de inscritos                         | —                                            | Evento gratuito                |                           |
| O-11   | Organizador | `org1@spole.dev`    | detalhe evento PAID          | Ver resumo, bookings e pagamentos          | Painéis carregam via API do evento           | 403 se não for dono            | Não usar rotas `/admin/*` |

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

| Código | Papel | Conta              | Rota inicial              | Passos                            | Resultado esperado                        | Erro esperado          | Seed / dados | Obs.      |
| ------ | ----- | ------------------ | ------------------------- | --------------------------------- | ----------------------------------------- | ---------------------- | ------------ | --------- |
| D-01   | User  | `user1@spole.dev`  | `/owner`                  | Tentar acessar                    | `AccessDenied`                            | —                      | —            |           |
| D-02   | Dono  | `arena1@spole.dev` | `/owner`                  | Abrir hub                         | Links para minhas arenas                  | —                      | —            |           |
| D-03   | Dono  | `arena1@spole.dev` | `/owner/arenas`           | Listar; filtrar; paginar          | `GET /users/me/arenas`                    | —                      | —            |           |
| D-04   | Dono  | `arena1@spole.dev` | `/owner/arenas/new`       | Criar arena                       | Lista revalida                            | `ARENA_SLUG_CONFLICT`  | —            |           |
| D-05   | Dono  | `arena1@spole.dev` | `…/edit`                  | Editar arena                      | Detalhe e lista atualizam                 | —                      | —            |           |
| D-06   | Dono  | `arena1@spole.dev` | `…/spaces`                | Criar espaço                      | Lista de espaços atualiza                 | —                      | —            |           |
| D-07   | Dono  | `arena1@spole.dev` | `…/spaces/[id]/slots`     | Criar slot unitário               | Lista do dia atualiza; sucesso            | `SLOT_OVERLAP` + ajuda | —            |           |
| D-08   | Dono  | `arena1@spole.dev` | slots                     | Criar slot que cruza existente    | Erro claro em PT                          | `SLOT_OVERLAP`         | —            |           |
| D-09   | Dono  | `arena1@spole.dev` | `…/reservations`          | Filtrar data/status               | Filtro **client-side**; aviso visível     | —                      | —            |           |
| D-10   | Dono  | `arena1@spole.dev` | `…/reservations/[id]`     | Abrir detalhe somente leitura     | Sem ações de cancelar/consumir            | —                      | —            |           |
| D-11   | Dono  | `arena1@spole.dev` | `…/agenda?date=`          | Navegar dias; ver reservas do dia | Só reservas; copy vs horários disponíveis | —                      | —            |           |
| D-12   | Dono  | `arena1@spole.dev` | slots / agenda / reservas | Seguir links cruzados             | Navegação coerente entre módulos          | —                      | —            | Sprint 14 |

---

## 5. Cross-cutting (todos os papéis)

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

## Registro de execução

| Data | Executor | Ambiente                      | Versão / branch | Notas |
| ---- | -------- | ----------------------------- | --------------- | ----- |
|      |          | local · API :3000 · Web :3001 |                 |       |
