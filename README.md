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
3. Sprints 00–10 entregues no participante (auth, eventos, checkout, conta, arenas, reserva, hardening).
4. Sprints 11A–11B: CRUD mínimo do organizador; Sprint **12A**: Admin UI (`/admin/*`); Sprint **13A**: Painel dono de arena (`/owner/*`).
5. Fora de escopo imediato: recorrência, gateway real, webhook no browser, `/search`, painel do dono de arena, `PATCH /users/me`.

## Troubleshooting

### API fora do ar ou `Failed to fetch`

- Confirme que o backend em `/api` está rodando (`pnpm dev` na pasta da API).
- Verifique `NEXT_PUBLIC_API_URL` em `.env.local` (ex.: `http://localhost:3000`).

### CORS / URL incorreta

- O front deve apontar para a **origem da API**, não para a porta do Next.js.
- Erros de CORS costumam indicar URL errada ou API não aceitando a origem do front (ex.: `http://localhost:3001`).
- Após a Sprint 10, o front envia `X-Request-Id` em todas as requisições. A API precisa permitir esse header em `Access-Control-Allow-Headers` (e expor `X-Request-Id` em `Access-Control-Expose-Headers` para ler o código de referência em erros). Reinicie a API após atualizar o CORS.

### Porta 3000 ocupada

Rode o frontend em outra porta e mantenha a API em 3000:

```powershell
pnpm.cmd dev -- -p 3001
```

### Seed de desenvolvimento

Use o seed/documentação do backend (`/api`) para usuários, eventos e arenas de teste.

### Pagamento mock permanece `PENDING`

O navegador **não** confirma pagamentos. Em desenvolvimento, dispare o webhook de teste do backend (ver Sprint 09 em `docs/01-sprints/`). O front faz polling em `GET /payments/:id` por até 5 minutos.

### Rate limit (HTTP 429)

Muitas tentativas retornam `RATE_LIMIT_EXCEEDED`. Aguarde o intervalo sugerido (header `Retry-After`, quando enviado) e tente de novo.

### Código de referência em erros

Em falhas operacionais (5xx, 429, erros genéricos), a UI pode exibir **Código de referência** com o `X-Request-Id` devolvido pela API — útil para suporte.

### Idempotência

Criar booking, pagamento de booking e pagamento de reserva enviam `Idempotency-Key` por tentativa. Reutilizar a mesma chave com payload diferente pode retornar `IDEMPOTENCY_KEY_REUSED` ou `IDEMPOTENCY_IN_PROGRESS`.

## Documentação

- [Visão do produto web](./docs/00-product/frontend-overview.md)
- [Sprint 00 — Foundation](./docs/01-sprints/sprint-00-frontend-foundation.md)
- [Sprint 10 — Client hardening](./docs/01-sprints/sprint-10-client-hardening-api12.md)
- [Sprint 12A — Admin UI operacional](./docs/01-sprints/sprint-12-admin-operational-ui.md)
- [Sprint 13A — Painel dono de arena](./docs/01-sprints/sprint-13-arena-owner-panel.md)
