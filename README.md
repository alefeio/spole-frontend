# Spolê — Frontend (`/web`)

Cliente web do Spolê (Next.js App Router), consumindo a API em `/api`.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- TanStack Query + Zod
- ESLint + Prettier

## Pré-requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+

## Configuração

Na pasta **`Projetos/web`** (não rode `cd web` de novo se o prompt já estiver em `...\web>`).

**PowerShell (Windows):**

```powershell
Copy-Item .env.example .env.local
```

**Git Bash / macOS / Linux:**

```bash
cp .env.example .env.local
```

Ajuste `NEXT_PUBLIC_API_URL` se necessário. O backend usa **porta 3000** por padrão (`/api/.env.example`).

## Scripts

Se o PowerShell bloquear `pnpm` (_execution of scripts is disabled_), use **`pnpm.cmd`** em vez de `pnpm`, ou libere scripts para o seu usuário (uma vez):

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**PowerShell:**

```powershell
pnpm.cmd install
pnpm.cmd dev
```

Se a API já ocupa a porta 3000, rode o frontend em outra porta:

```powershell
pnpm.cmd dev -- -p 3001
```

**Git Bash / macOS / Linux:**

```bash
pnpm install
pnpm dev
pnpm dev -- -p 3001
```

Outros comandos: `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm format:write`.

## Estrutura

```
src/
  app/           # Rotas (grupos: public, auth, app, admin)
  components/    # UI compartilhada (layout, feedback, shadcn)
  features/      # Domínios (api.ts por feature → lib/api/client)
  lib/api/       # Cliente HTTP centralizado (único uso de fetch para API)
  lib/auth/      # Token storage (stubs)
  providers/     # QueryProvider, AppProviders
  styles/        # globals.css
docs/            # Documentação do frontend
```

## Regras

1. **Não** chamar `fetch` em páginas ou componentes — usar `src/lib/api/client.ts` via `src/features/*/api.ts`.
2. Contrato HTTP: [`docs/02-features/api-contract-map.md`](./docs/02-features/api-contract-map.md).
3. Sprints **00–15**: MVP web (participante, organizador, admin, dono de arena, hardening e QA operacional).
4. Fora de escopo imediato: recorrência operacional, webhook no browser, `/search`, `PATCH /users/me`.

## Troubleshooting

### API fora do ar ou `Failed to fetch`

- Confirme que o backend em `/api` está rodando (`pnpm dev` na pasta da API).
- Verifique `NEXT_PUBLIC_API_URL` em `.env.local` (ex.: `http://localhost:3000`).

### CORS / URL incorreta

- O front deve apontar para a **origem da API**, não para a porta do Next.js.
- Erros de CORS costumam indicar URL errada ou API não aceitando a origem do front (ex.: `http://localhost:3001`).
- O front envia `X-Request-Id` em **mutações** (POST/PATCH/DELETE) e quando há `Idempotency-Key`. A API precisa permitir esse header em `Access-Control-Allow-Headers` e expor `X-Request-Id` em `Access-Control-Expose-Headers` para o código de referência em erros. Reinicie a API após atualizar o CORS.

### Porta 3000 ocupada

Rode o frontend em outra porta e mantenha a API em 3000:

```powershell
pnpm.cmd dev -- -p 3001
```

### Seed de desenvolvimento

Senha padrão do seed: `SpoleDev123!` (ver [`/api/docs/02-dev-seed.md`](../api/docs/02-dev-seed.md)).

Contas úteis:

| Papel         | E-mail             |
| ------------- | ------------------ |
| Participante  | `user1@spole.dev`  |
| Organizador   | `org1@spole.dev`   |
| Dono de arena | `arena1@spole.dev` |
| Admin         | `admin@spole.dev`  |

Na pasta `/api`: `npm run db:seed:dev` (não use em produção).

### Pagamento Pix (checkout real)

Configure no **frontend** (`web/.env.local`):

- `NEXT_PUBLIC_API_URL` — URL que o navegador alcança (ex.: túnel ngrok da API em homologação).
- `NEXT_PUBLIC_PAYMENTS_PROVIDER=asaas` (padrão em `.env.example`).

Configure no **backend** (`api/.env`):

- `PAYMENTS_PROVIDER=asaas` e credenciais Asaas.
- Webhook Asaas apontando para a URL pública da API (ex.: `https://<túnel>/payments/webhook`).

O front exibe QR e copia-e-cola do campo `checkout` e faz polling em `GET /payments/:id` por até 5 minutos enquanto o status for `PENDING`.

O navegador **não** confirma pagamentos nem chama webhook. Em **desenvolvimento** com `mock`, use `NEXT_PUBLIC_PAYMENTS_PROVIDER=mock` e dispare o webhook de teste no servidor (Sprint 09 / README da API).

Homologação ponta a ponta (H-19): checklist [`docs/03-qa/mvp-operational-checklist.md`](./docs/03-qa/mvp-operational-checklist.md#5-homologação-pix-real-h-19) (roteiros A/B/C) · contexto [`docs/01-sprints/sprint-19-real-integration-homologation.md`](./docs/01-sprints/sprint-19-real-integration-homologation.md).

Webhooks no túnel (exemplos): `https://<túnel>/payments/webhook` (booking) e `https://<túnel>/reservation-payments/webhook` (reserva).

### Rate limit (HTTP 429)

Muitas tentativas retornam `RATE_LIMIT_EXCEEDED`. Aguarde o intervalo sugerido (header `Retry-After`, quando enviado) e tente de novo.

### Código de referência em erros

Em falhas operacionais (5xx, 429, erros genéricos), a UI pode exibir **Código de referência** com o `X-Request-Id` devolvido pela API — útil para suporte.

### Idempotência

Criar booking, pagamento de booking e pagamento de reserva enviam `Idempotency-Key` por tentativa. Reutilizar a mesma chave com payload diferente pode retornar `IDEMPOTENCY_KEY_REUSED` ou `IDEMPOTENCY_IN_PROGRESS`.

## Homologação (QA manual)

Checklist operacional do MVP: [`docs/03-qa/mvp-operational-checklist.md`](./docs/03-qa/mvp-operational-checklist.md).

## Documentação

- [Visão do produto web](./docs/00-product/frontend-overview.md)
- [Checklist QA do MVP](./docs/03-qa/mvp-operational-checklist.md)
- [Sprint 00 — Foundation](./docs/01-sprints/sprint-00-frontend-foundation.md)
- [Sprint 10 — Client hardening](./docs/01-sprints/sprint-10-client-hardening-api12.md)
- [Sprint 12A — Admin UI operacional](./docs/01-sprints/sprint-12-admin-operational-ui.md)
- [Sprint 13A — Painel dono de arena](./docs/01-sprints/sprint-13-arena-owner-panel.md)
- [Sprint 13B — Minhas arenas (listagem)](./docs/01-sprints/sprint-13b-owner-arenas-listing.md)
- [Sprint 13C — Refinamento painel dono](./docs/01-sprints/sprint-13c-owner-panel-refinement.md)
- [Sprint 14 — Horários e agenda do dono](./docs/01-sprints/sprint-14-owner-slots-agenda.md)
- [Sprint 15 — QA e hardening do MVP](./docs/01-sprints/sprint-15-mvp-qa-hardening.md)
- [Sprint 16 — Arenas públicas e operação do evento](./docs/01-sprints/sprint-16-read-models-discovery-operations.md)
- [Sprint 18 — Pagamento Pix real](./docs/01-sprints/sprint-18-real-pix-integration.md)
- [Sprint 19 — Homologação Pix real](./docs/01-sprints/sprint-19-real-integration-homologation.md)
