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

Outros comandos: `pnpm build`, `pnpm lint`, `pnpm format`.

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
3. Frontend **1 sprint atrás** do backend.
4. Fora de escopo imediato: pagamento de reserva de arena, recorrência, módulo `/search`, admin avançado.

## Documentação

- [Visão do produto web](./docs/00-product/frontend-overview.md)
- [Sprint 00 — Foundation](./docs/01-sprints/sprint-00-frontend-foundation.md)
