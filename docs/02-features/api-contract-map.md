# Mapa de contrato — API Spolê (referência para o frontend)

> **Fonte:** código em `/api/src` (rotas, schemas Zod, `api-response`, middleware) e documentação em `/api/docs`.  
> **Última revisão:** maio/2026 — backend até sprint 10.  
> **Uso no frontend:** base para tipos, client HTTP e planejamento de telas. Não inventar rotas além desta lista.

---

## 1. Módulos existentes no backend

| Módulo             | Pasta (`/api/src/modules/`) | Rotas registradas em `app.ts` | Observação                                                    |
| ------------------ | --------------------------- | ----------------------------- | ------------------------------------------------------------- |
| Health             | `http/routes/health.ts`     | Sim                           | Operação / deploy                                             |
| Auth               | `auth/`                     | Sim                           | Register, login                                               |
| Users              | `users/`                    | Sim                           | Perfil e listagens autenticadas                               |
| Categories         | `categories/`               | Sim                           | Catálogo público + CRUD admin                                 |
| Events             | `events/`                   | Sim                           | CRUD + listagem pública (inclui busca MVP)                    |
| Event participants | `event-participants/`       | Sim                           | Inscrição gratuita + lista                                    |
| Bookings           | `bookings/`                 | Sim                           | Reserva temporária em evento pago                             |
| Payments           | `payments/`                 | Sim                           | Pagamento de booking, reserva e ocorrência                    |
| Reservations       | `reservations/`             | Sim                           | Reserva de slot de arena                                      |
| Spaces             | `spaces/`                   | Sim                           | Espaços internos da arena                                     |
| Slots              | `slots/`                    | Sim                           | Horários por espaço                                           |
| Arenas             | `arenas/`                   | Sim                           | Arena, slots agregados, reservas da arena                     |
| Notifications      | `notifications/`            | Sim                           | Marcar como lida (listagem via users)                         |
| Search             | —                           | **Não** (módulo separado)     | Busca via `GET /events?q=...`                                 |
| Admin              | `admin/`                    | Sim                           | Listagens operacionais + PATCH status (users, arenas, events) |

---

## 2. Convenções globais

### 2.1 Envelope de sucesso

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

`meta` é opcional (listagens paginadas).

### 2.2 Envelope de erro

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found",
    "details": []
  }
}
```

- Validação Zod em rotas: HTTP **400**, `code`: `VALIDATION_ERROR`, `details`: `[{ "path": "campo", "message": "..." }]`.
- Erros de domínio: `AppError` → status e `code` específicos (seção 7).
- Erro não tratado: HTTP **500**, `INTERNAL_SERVER_ERROR`.

### 2.3 Autenticação (JWT)

| Item                   | Valor                                                                       |
| ---------------------- | --------------------------------------------------------------------------- |
| Header                 | `Authorization: Bearer <accessToken>`                                       |
| Emissão                | `POST /auth/login` → campo `data.token`                                     |
| Claims no token        | `sub` (user id), `role`, `status`                                           |
| Roles                  | `user`, `arena_owner`, `admin`                                              |
| Status de usuário      | `ACTIVE`, `SUSPENDED`, `INACTIVE`                                           |
| Usuário suspenso       | Login: **403** `USER_SUSPENDED`; rotas protegidas: **403** `USER_SUSPENDED` |
| Token ausente/inválido | **401** `UNAUTHORIZED`                                                      |
| Role insuficiente      | **403** `FORBIDDEN` (middleware `requireRoles`)                             |

**`optionalAuth`:** usado em `GET /events/:id` — token válido preenche `req.auth` (organizador vê campos extras); token inválido ou ausente não bloqueia a rota.

### 2.4 Paginação

| Query   | Regra                                             |
| ------- | ------------------------------------------------- |
| `page`  | Inteiro ≥ 1, default `1`                          |
| `limit` | Inteiro 1–100, default `10` (slots: default `50`) |

**Meta padrão** (`PaginationMeta` + extras em eventos):

```json
{
  "page": 1,
  "limit": 10,
  "total": 42
}
```

`GET /events` adiciona em `meta`: `sort` (`startAt`), `order` (`asc` | `desc`).

Endpoints paginados hoje: `GET /events`, `GET /users/me/events`, `GET /arenas/:arenaId/slots`, `GET /spaces/:spaceId/slots`, `GET /users/me/notifications`, `GET /users/me/bookings`, `GET /users/me/payments`.

Listagens **sem** paginação na API atual: `GET /categories`, `GET /reservations/me`, `GET /users/me/participants`, `GET /events/:eventId/participants`, `GET /arenas/:arenaId/reservations`, `GET /arenas/:arenaId/spaces`.

### 2.5 Busca de eventos (MVP — sem `/search`)

Implementada em **`GET /events`** (não existe `GET /search`).

| Query                | Tipo                | Descrição                                        |
| -------------------- | ------------------- | ------------------------------------------------ |
| `q`                  | string              | Busca textual em `title` e `description` (ILIKE) |
| `category`           | uuid                | Filtro por `categoryId`                          |
| `city`               | string              | Filtro por cidade                                |
| `dateFrom`, `dateTo` | ISO 8601 com offset | Intervalo em `startAt`                           |
| `type`               | `FREE` \| `PAID`    | Tipo do evento                                   |
| `sort`               | `startAt`           | Default `startAt`                                |
| `order`              | `asc` \| `desc`     | Default `asc`                                    |
| `page`, `limit`      | ver §2.4            | Paginação                                        |

Somente eventos `PUBLIC` + `PUBLISHED` + categoria `ACTIVE`.

---

## 3. Endpoints por módulo

Legenda de auth: **Público** | **JWT** (qualquer role autenticada salvo indicação) | **Role** | **Webhook** (segredo em header).

---

### 3.1 Health

| Método | Rota      | Auth    | Descrição          |
| ------ | --------- | ------- | ------------------ |
| GET    | `/health` | Público | Saúde da aplicação |

**Resposta 200:** `data: { "status": "ok" }`  
**Resposta 500:** `DEPENDENCY_INCONSISTENT` + `details` com snapshot.

---

### 3.2 Auth

| Método | Rota             | Auth    | Descrição |
| ------ | ---------------- | ------- | --------- |
| POST   | `/auth/register` | Público | Cadastro  |
| POST   | `/auth/login`    | Público | Login     |

#### `POST /auth/register`

**Body:**

```json
{
  "name": "string (1-200)",
  "email": "email",
  "password": "min 8, maiúscula, minúscula, dígito",
  "phone": "string opcional (8-32)"
}
```

**Resposta 201 — `data`:**

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "user"
}
```

**Erros:** `VALIDATION_ERROR` (400), `EMAIL_ALREADY_EXISTS` (409).

#### `POST /auth/login`

**Body:** `{ "email", "password" }`

**Resposta 200 — `data`:**

```json
{
  "token": "jwt",
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "user | arena_owner | admin"
  }
}
```

**Erros:** `VALIDATION_ERROR` (400), `INVALID_CREDENTIALS` (401), `USER_SUSPENDED` (403).

---

### 3.3 Users

| Método | Rota                      | Auth                  | Descrição                    |
| ------ | ------------------------- | --------------------- | ---------------------------- |
| GET    | `/users/me`               | JWT                   | Perfil autenticado           |
| GET    | `/users/me/events`        | JWT + filtros/página  | Meus eventos (organizador)   |
| GET    | `/users/me/participants`  | JWT                   | Minhas inscrições em eventos |
| GET    | `/users/me/notifications` | JWT + `page`, `limit` | Notificações                 |
| GET    | `/users/me/bookings`      | JWT + `page`, `limit` | Meus bookings                |
| GET    | `/users/me/payments`      | JWT + `page`, `limit` | Meus pagamentos              |

> **`PATCH /users/me` não existe** na API atual (spec de produto prevê atualização futura).

#### `GET /users/me` — `data`

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "string",
  "status": "ACTIVE | SUSPENDED | INACTIVE"
}
```

#### `GET /users/me/participants` — `data`

Array de participações (campos definidos no service; inclui vínculo com evento).

#### `GET /users/me/notifications` — `data` + `meta`

Lista paginada de notificações do usuário.

#### `GET /users/me/bookings` — `data` + `meta`

Lista paginada de bookings (estados: `RESERVED`, `EXPIRED`, `CANCELLED`, `COMPLETED`).

#### `GET /users/me/payments` — `data` + `meta`

Lista paginada de pagamentos do usuário.

#### `GET /users/me/events` — `data` + `meta`

Lista paginada dos eventos em que o usuário autenticado é `organizerId`. Inclui `DRAFT`, `PUBLISHED`, `CANCELLED`, `PUBLIC`, `PRIVATE`, `FREE_LOCATION`, `ARENA_RESERVATION`. **Não retorna** `privateCode`.

| Query        | Descrição                                                     |
| ------------ | ------------------------------------------------------------- |
| `page`       | Página (default 1)                                            |
| `limit`      | Itens por página (máx. 100)                                   |
| `q`          | Busca em título/descrição                                     |
| `status`     | `DRAFT` \| `PUBLISHED` \| `CANCELLED`                         |
| `visibility` | `PUBLIC` \| `PRIVATE`                                         |
| `type`       | `FREE` \| `PAID`                                              |
| `sourceType` | `FREE_LOCATION` \| `ARENA_RESERVATION`                        |
| `categoryId` | UUID da categoria                                             |
| `dateFrom`   | ISO com offset — filtro em `startAt`                          |
| `dateTo`     | ISO com offset                                                |
| `sort`       | `startAt` \| `createdAt` \| `updatedAt` (default `updatedAt`) |
| `order`      | `asc` \| `desc` (default `desc`)                              |

Item típico em `data`: `id`, `title`, `status`, `visibility`, `type`, `sourceType`, `categoryId`, `startAt`, `endAt`, `city`, `state`, `capacity`, `pricePerPerson`, `createdAt`, `updatedAt`.

---

### 3.4 Categories

| Método | Rota              | Auth          | Descrição                       |
| ------ | ----------------- | ------------- | ------------------------------- |
| GET    | `/categories`     | Público       | Lista categorias ativas (cache) |
| POST   | `/categories`     | JWT **admin** | Criar                           |
| PATCH  | `/categories/:id` | JWT **admin** | Atualizar                       |
| DELETE | `/categories/:id` | JWT **admin** | Remover                         |

#### `POST /categories` — body

```json
{
  "name": "string",
  "slug": "kebab-case",
  "icon": "string opcional",
  "status": "ACTIVE | INACTIVE (opcional, default ACTIVE)"
}
```

#### `PATCH /categories/:id` — body (parcial)

`name`, `slug`, `icon` (nullable), `status` — ao menos um campo.

#### Respostas

- GET: `data` = array de categorias públicas.
- POST/PATCH: `data` = categoria criada/atualizada.
- DELETE: `data` = `{ "id", "deleted": true }`.

**Erros:** `SLUG_ALREADY_EXISTS` (409), `CATEGORY_NOT_FOUND` (404), `CATEGORY_IN_USE` (409 no delete).

---

### 3.5 Events

| Método | Rota          | Auth                                   | Descrição                |
| ------ | ------------- | -------------------------------------- | ------------------------ |
| GET    | `/events`     | Público                                | Listagem + busca/filtros |
| GET    | `/events/:id` | Público + **optionalAuth**             | Detalhe                  |
| POST   | `/events`     | JWT `user` \| `arena_owner` \| `admin` | Criar                    |
| PATCH  | `/events/:id` | JWT (dono ou admin)                    | Atualizar                |
| DELETE | `/events/:id` | JWT (dono ou admin)                    | Cancelar logicamente     |

#### `GET /events/:id` — query

| Param         | Uso                                                          |
| ------------- | ------------------------------------------------------------ |
| `privateCode` | Obrigatório para acesso a evento `PRIVATE` (não organizador) |

#### `POST /events` — body (discriminado por `sourceType`)

**`sourceType: "FREE_LOCATION"`** — evento em local livre:

Campos obrigatórios principais: `categoryId`, `title`, `type` (`FREE`|`PAID`), `visibility`, `sourceType`, `status` (`DRAFT`|`PUBLISHED`), `startAt`, `endAt` (ISO com offset), endereço (`addressName`, `street`, `number`, `district`, `city`, `state`), `capacity`, opcionais `description`, `pricePerPerson`, `privateCode`.

**`sourceType: "ARENA_RESERVATION"`** — evento vinculado à reserva:

`categoryId`, `reservationId`, `title`, `type`, `visibility`, `sourceType`, `status`, `capacity`, opcionais `description`, `pricePerPerson`, `privateCode`. Datas/local derivados da reserva.

Regras: evento `PAID` exige `pricePerPerson > 0`; `PUBLIC` não aceita `privateCode` no body.

#### `PATCH /events/:id` — body parcial

Mesmos campos editáveis (sem trocar `sourceType` / `reservationId` via patch simples).

#### `GET /events` — item em `data` (resumo)

```json
{
  "id", "title", "type", "visibility", "city", "state",
  "startAt", "capacity", "pricePerPerson"
}
```

#### `GET /events/:id` — `data` (detalhe)

**Visitante / não-dono:** payload reduzido (`id`, `title`, `description`, `type`, `visibility`, `status`, `sourceType`, `startAt`, `endAt`, `addressName`, `city`, `state`, `capacity`, `pricePerPerson`). Evento `PRIVATE` exige `privateCode` na query.

**Organizador ou admin:** payload completo para edição — inclui `categoryId`, `street`, `number`, `district`, `reservationId` (se houver), `privateCode` (se `PRIVATE`), `locationReadOnly` (`true` para `ARENA_RESERVATION`, `false` para `FREE_LOCATION`).

**Erros frequentes:** `EVENT_NOT_FOUND`, `FORBIDDEN`, `INVALID_CATEGORY`, `INACTIVE_CATEGORY`, `RESERVATION_NOT_FOUND`, `RESERVATION_INVALID_STATE`, `EVENT_CANCELLED`.

---

### 3.6 Event participants

| Método | Rota                                 | Auth | Descrição                               |
| ------ | ------------------------------------ | ---- | --------------------------------------- |
| POST   | `/events/:eventId/participants/free` | JWT  | Inscrição em evento gratuito            |
| GET    | `/events/:eventId/participants`      | JWT  | Lista participantes (organizador/admin) |

#### `POST .../free` — query

`privateCode` — para eventos privados.

**Resposta 201:** participante criado (`CONFIRMED` em evento gratuito).

**Erros:** `EVENT_NOT_FREE`, `EVENT_NOT_OPEN_FOR_JOIN`, `EVENT_FULL`, `ALREADY_REGISTERED`, `FORBIDDEN`.

---

### 3.7 Bookings (evento pago)

| Método | Rota                        | Auth | Descrição                          |
| ------ | --------------------------- | ---- | ---------------------------------- |
| POST   | `/events/:eventId/bookings` | JWT  | Inicia reserva temporária (30 min) |
| PATCH  | `/bookings/:id/cancel`      | JWT  | Cancela booking reservável         |

#### `POST /events/:eventId/bookings` — query

`privateCode` — eventos privados.

**Resposta 201 — `data`:**

```json
{
  "id": "uuid",
  "eventId": "uuid",
  "userId": "uuid",
  "status": "RESERVED",
  "expiresAt": "timestamp"
}
```

TTL: env `BOOKING_TTL_SECONDS` (default **1800**). Redis: `spole:booking:{id}`.

**Erros:** `EVENT_NOT_PAID`, `EVENT_NOT_OPEN_FOR_BOOKING`, `EVENT_FULL`, `BOOKING_CONFLICT`, `ALREADY_REGISTERED`, `REDIS_UNAVAILABLE` (500).

#### `PATCH /bookings/:id/cancel` — `data`

Booking atualizado (`CANCELLED` quando aplicável).

---

### 3.8 Payments

| Método | Rota                                              | Auth    | Descrição                                    |
| ------ | ------------------------------------------------- | ------- | -------------------------------------------- |
| POST   | `/payments/webhook`                               | Webhook | Confirma pagamento de **booking**            |
| POST   | `/reservation-payments/webhook`                   | Webhook | Confirma pagamento de **reserva/ocorrência** |
| POST   | `/bookings/:bookingId/payments`                   | JWT     | Cria pagamento pendente (ingresso)           |
| POST   | `/reservations/:reservationId/payments`           | JWT     | Cria pagamento pendente (reserva arena)      |
| POST   | `/reservation-occurrences/:occurrenceId/payments` | JWT     | Pagamento de ocorrência recorrente           |
| GET    | `/payments/:id`                                   | JWT     | Detalhe do pagamento                         |

#### Webhooks (somente servidor / integração — não chamar do browser)

| Rota                                 | Header                                       |
| ------------------------------------ | -------------------------------------------- |
| `POST /payments/webhook`             | `X-Spole-Payment-Webhook-Secret`             |
| `POST /reservation-payments/webhook` | `X-Spole-Reservation-Payment-Webhook-Secret` |

**Body webhook:**

```json
{
  "providerReference": "string (obrigatório)",
  "status": "PAID"
}
```

Apenas `status: PAID` é aceito para concluir fluxo.

#### `POST .../payments` (criação) — body

```json
{
  "method": "PIX",
  "provider": "mock-provider"
}
```

Únicos valores aceitos hoje (`payments/shared.ts`).

**Resposta 201 (booking) — `data` exemplo:**

```json
{
  "id", "bookingId", "status": "PENDING",
  "method", "provider", "providerReference",
  "grossAmount", "feeAmount", "netAmount"
}
```

`Payment` é polimórfico: exatamente um entre `bookingId`, `reservationId`, `reservationOccurrenceId`.

**Erros:** `BOOKING_NOT_PAYABLE`, `BOOKING_EXPIRED`, `RESERVATION_NOT_PAYABLE`, `RESERVATION_EXPIRED`, `PAYMENT_ALREADY_EXISTS`, `INVALID_PAYMENT_METHOD`, `INVALID_PAYMENT_PROVIDER`.

---

### 3.9 Reservations (arena)

| Método | Rota                       | Auth | Descrição       |
| ------ | -------------------------- | ---- | --------------- |
| POST   | `/reservations`            | JWT  | Criar reserva   |
| GET    | `/reservations/me`         | JWT  | Minhas reservas |
| GET    | `/reservations/:id`        | JWT  | Detalhe         |
| PATCH  | `/reservations/:id/cancel` | JWT  | Cancelar        |

#### `POST /reservations` — body

```json
{
  "slotId": "uuid",
  "type": "SINGLE | RECURRING"
}
```

**Resposta 201:** reserva criada (`PENDING`, slot em `HOLD`, `expiresAt` conforme `RESERVATION_TTL_SECONDS`).

**Erros:** `SLOT_NOT_FOUND`, `SLOT_UNAVAILABLE`, `RECURRENCE_NOT_ALLOWED`, `MIN_ADVANCE_VIOLATION`, `RESERVATION_CONFLICT`.

#### Recorrência (Sprint 10)

- Após confirmação financeira, pode gerar próxima ocorrência semanal.
- Ocorrência não paga até **24h antes** do horário → slot liberado (`RELEASED`).
- Pagamento por ocorrência: `POST /reservation-occurrences/:occurrenceId/payments`.

> **Frontend:** pagamento mock de reserva SINGLE implementado (Sprints 09–10). **Recorrência** e pagamento por ocorrência permanecem fora de escopo (§8).

---

### 3.10 Arenas, spaces, slots

#### Arenas

| Método | Rota                            | Auth                         | Descrição                   |
| ------ | ------------------------------- | ---------------------------- | --------------------------- |
| POST   | `/arenas`                       | JWT `arena_owner` \| `admin` | Criar arena                 |
| GET    | `/arenas/:id`                   | Público                      | Detalhe                     |
| PATCH  | `/arenas/:id`                   | JWT dono da arena ou admin   | Atualizar                   |
| GET    | `/arenas/:arenaId/slots`        | Público                      | Slots da arena (paginado)   |
| GET    | `/arenas/:arenaId/reservations` | JWT dono da arena ou admin   | Reservas da arena           |
| GET    | `/arenas/:arenaId/spaces`       | Público                      | Espaços (via módulo spaces) |

> **`GET /arenas` (listagem global) não existe.**

#### `POST /arenas` — body

```json
{
  "name", "description?", "phone", "email", "document",
  "address": { "zipCode", "street", "number", "district", "city", "state" },
  "policy": {
    "allowRecurring": boolean,
    "minAdvanceHours": number,
    "minReservationPaymentPercent": 0-100
  }
}
```

#### Spaces

| Método | Rota                      | Auth                   |
| ------ | ------------------------- | ---------------------- |
| GET    | `/arenas/:arenaId/spaces` | Público                |
| POST   | `/arenas/:arenaId/spaces` | JWT dono arena / admin |

**POST body:** `name`, `type`, `description?`, `capacitySuggestion?`, `status?`.

#### Slots

| Método | Rota                     | Auth                                              |
| ------ | ------------------------ | ------------------------------------------------- |
| GET    | `/spaces/:spaceId/slots` | Público + `page`, `limit`, `dateFrom?`, `dateTo?` |
| POST   | `/spaces/:spaceId/slots` | JWT gestão do espaço                              |

**POST body:** `startAt`, `endAt` (ISO), `price` (≥ 0), `allowsRecurring`, `notes?`.

---

### 3.11 Notifications

| Método | Rota                      | Auth | Descrição       |
| ------ | ------------------------- | ---- | --------------- |
| PATCH  | `/notifications/:id/read` | JWT  | Marca como lida |

Listagem: `GET /users/me/notifications`.

**Erros:** `NOTIFICATION_NOT_FOUND`, `FORBIDDEN`.

---

## 4. Regras de autenticação e autorização (resumo)

| Padrão                     | Comportamento                                      |
| -------------------------- | -------------------------------------------------- |
| Rotas públicas             | Sem header; falha de validação só em query/body    |
| `requireAuth`              | Bearer obrigatório; usuário `ACTIVE`               |
| `requireRoles([...])`      | Role deve estar na lista                           |
| `requireArenaOwnerOrAdmin` | Param `arenaId` / `id` — dono da arena ou `admin`  |
| `requireSpaceManageAccess` | Dono da arena do espaço ou `admin`                 |
| Ownership em eventos       | Organizador do evento ou `admin` para PATCH/DELETE |
| Webhooks                   | Segredo compartilhado no header; sem JWT           |

---

## 5. Padrão de erros

### 5.1 HTTP × código

| HTTP | Origem típica                                                                              |
| ---- | ------------------------------------------------------------------------------------------ |
| 400  | `VALIDATION_ERROR`, `INVALID_WEBHOOK_PAYLOAD`                                              |
| 401  | `UNAUTHORIZED`, `INVALID_CREDENTIALS`                                                      |
| 403  | `FORBIDDEN`, `USER_SUSPENDED`, `WEBHOOK_FORBIDDEN`                                         |
| 404  | `RESOURCE_NOT_FOUND` (catch-all), `*_NOT_FOUND`                                            |
| 409  | Conflitos (`EMAIL_ALREADY_EXISTS`, `EVENT_FULL`, `BOOKING_*`, `PAYMENT_ALREADY_EXISTS`, …) |
| 422  | Regras de domínio (`EVENT_NOT_PAID`, `UNSUPPORTED_WEBHOOK_STATUS`, …)                      |
| 500  | `INTERNAL_SERVER_ERROR`, falhas operacionais (`REDIS_UNAVAILABLE`, `*_CREATE_FAILED`)      |

### 5.2 Códigos de domínio (inventário principal)

`EMAIL_ALREADY_EXISTS`, `INVALID_CREDENTIALS`, `USER_SUSPENDED`, `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`, `INTERNAL_SERVER_ERROR`, `SLUG_ALREADY_EXISTS`, `CATEGORY_NOT_FOUND`, `CATEGORY_IN_USE`, `EVENT_NOT_FOUND`, `EVENT_NOT_OPEN_FOR_BOOKING`, `EVENT_NOT_PAID`, `EVENT_NOT_FREE`, `EVENT_NOT_OPEN_FOR_JOIN`, `EVENT_FULL`, `FORBIDDEN`, `ALREADY_REGISTERED`, `BOOKING_NOT_FOUND`, `BOOKING_NOT_PAYABLE`, `BOOKING_EXPIRED`, `BOOKING_CONFLICT`, `BOOKING_NOT_CANCELLABLE`, `PAYMENT_NOT_FOUND`, `PAYMENT_ALREADY_EXISTS`, `PAYMENT_CANNOT_COMPLETE`, `INVALID_PAYMENT_METHOD`, `INVALID_PAYMENT_PROVIDER`, `SLOT_NOT_FOUND`, `SLOT_UNAVAILABLE`, `RESERVATION_NOT_FOUND`, `RESERVATION_NOT_PAYABLE`, `RESERVATION_EXPIRED`, `RESERVATION_CONFLICT`, `RECURRENCE_NOT_ALLOWED`, `OCCURRENCE_NOT_FOUND`, `NOTIFICATION_NOT_FOUND`, `DEPENDENCY_INCONSISTENT`, `WEBHOOK_FORBIDDEN`.

---

## 6. Padrão de paginação (implementação)

- Schema: `/api/src/shared/http/pagination.ts`.
- Resposta: sempre `data` (array) + `meta` com `page`, `limit`, `total`.
- Eventos: `meta` estendido com `sort` e `order`.

---

## 7. Telas frontend impactadas

Mapeamento sugerido (App Router) — rotas de UI a definir na implementação.

| Área / tela             | Endpoints principais                                                                      | Perfis                               |
| ----------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| Landing / home          | `GET /events`, `GET /categories`                                                          | Todos                                |
| Busca e filtros         | `GET /events?q&category&city&dateFrom&dateTo&type`                                        | Todos                                |
| Detalhe do evento       | `GET /events/:id`, `privateCode`                                                          | Todos                                |
| Login / cadastro        | `POST /auth/login`, `POST /auth/register`                                                 | Todos                                |
| Minha conta             | `GET /users/me`                                                                           | Autenticado                          |
| Meus eventos            | `GET /users/me/events`, `GET /events/:id` (detalhe completo dono)                         | Organizador                          |
| Criar / editar evento   | `POST /events`, `PATCH /events/:id`, `DELETE /events/:id`                                 | Organizador                          |
| Inscrição gratuita      | `POST /events/:id/participants/free`                                                      | Autenticado                          |
| Compra de vaga (pago)   | `POST /events/:id/bookings` → `POST /bookings/:id/payments` → polling `GET /payments/:id` | Autenticado                          |
| Minhas inscrições       | `GET /users/me/participants`                                                              | Autenticado                          |
| Meus bookings           | `GET /users/me/bookings`, `PATCH /bookings/:id/cancel`                                    | Autenticado                          |
| Meus pagamentos         | `GET /users/me/payments`, `GET /payments/:id`                                             | Autenticado                          |
| Notificações            | `GET /users/me/notifications`, `PATCH /notifications/:id/read`                            | Autenticado                          |
| Participantes do evento | `GET /events/:eventId/participants`                                                       | Organizador                          |
| Explorar arena          | `GET /arenas/:id`, `GET /arenas/:id/spaces`, `GET /arenas/:id/slots`                      | Todos / organizador                  |
| Cadastro de arena       | `POST /arenas`, `PATCH /arenas/:id`                                                       | `arena_owner`                        |
| Espaços e slots         | `POST /arenas/:id/spaces`, `POST /spaces/:id/slots`                                       | Dono arena                           |
| Reservar horário        | `POST /reservations`, `GET /reservations/me`, `GET /reservations/:id`                     | Organizador                          |
| Pagar reserva de arena  | `POST /reservations/:id/payments`, polling `GET /payments/:id`                            | Autenticado — **UI mock Sprint 09+** |
| Painel arena — reservas | `GET /arenas/:arenaId/reservations`                                                       | Dono arena                           |
| Admin — categorias      | `POST/PATCH/DELETE /categories`                                                           | `admin`                              |
| Health (ops)            | `GET /health`                                                                             | Interno                              |

---

## 8. Pontos pendentes ou instáveis

| Item                                   | Situação                                                                                  | Impacto no frontend                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Pagamento de reserva de arena          | API com **mock-provider**; frontend com checkout mock (Sprint 09) + hardening (Sprint 10) | Recorrência e gateway real **fora** do escopo; confirmação via backend/webhook de teste em dev     |
| Recorrência semanal                    | Mínima (`RECURRING` + ocorrências + liberação 24h)                                        | UI de recorrência **adiada**; documentar estados antes de desenhar wizard                          |
| Webhooks de pagamento                  | Apenas backend / simulação manual                                                         | Frontend **não** chama webhooks; confirmação via polling `GET /payments/:id` ou ambiente de testes |
| `PATCH /users/me`                      | Não existe                                                                                | Sem tela de edição de perfil até o backend expor rota                                              |
| `GET /arenas` (lista)                  | Não existe                                                                                | Descoberta de arenas só por ID/link direto                                                         |
| Módulo admin                           | Sem rotas dedicadas                                                                       | Painel admin limitado a categorias (JWT admin)                                                     |
| Atualização de perfil / avatar         | Spec em `/api/docs/02-features/users.md`, sem rota                                        | Fora do escopo imediato                                                                            |
| Search dedicado                        | Spec futura; hoje = `GET /events`                                                         | Não criar cliente para `/search`                                                                   |
| Reembolso, split, antifraude           | Fora do MVP                                                                               | Não modelar na UI                                                                                  |
| Edição de slots / cancelamento de slot | Sem `PATCH`/`DELETE` em slots na API                                                      | Gestão de agenda parcial no frontend                                                               |

### Estabilidade recomendada para a 1ª sprint frontend

Priorizar recorte equivalente à **sprint 9 do backend** (estável):

- Auth, listagem/detalhe de eventos, categorias públicas
- Inscrição gratuita, bookings + pagamento de **evento pago** (mock)
- Conta: `me`, notificações, bookings e payments paginados
- Adiar: reserva de arena paga, recorrência, painel financeiro de arena

---

## 9. Referências no repositório

| Recurso           | Caminho                                 |
| ----------------- | --------------------------------------- |
| Registro de rotas | `/api/src/app.ts`                       |
| Padrões REST      | `/api/docs/00-product/api-standards.md` |
| Specs por domínio | `/api/docs/02-features/*.md`            |
| Sprints backend   | `/api/docs/01-sprints/sprint-*.md`      |
| Dívida técnica    | `/api/docs/99-tech-debt.md`             |

---

## 10. Changelog deste documento

| Data    | Alteração                                                                     |
| ------- | ----------------------------------------------------------------------------- |
| 2026-05 | Criação inicial a partir do inventário de rotas em `/api/src` (até sprint 10) |
