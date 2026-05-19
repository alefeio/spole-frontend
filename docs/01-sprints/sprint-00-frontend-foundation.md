# Sprint 00 — Frontend Foundation

## Objetivo

Bootstrap do projeto `/web` com stack acordada, estrutura por features, camada de API preparada, layouts e páginas placeholder — **sem** fluxos de negócio integrados.

## Escopo

- Projeto Next.js (App Router) + TypeScript + Tailwind v4
- shadcn/ui (base: `Button`, tokens CSS, `components.json`)
- TanStack Query (`QueryProvider`)
- Zod (dependência instalada para validações futuras)
- ESLint + Prettier + alias `@/*`
- Grupos de rota: `(public)`, `(auth)`, `(app)`, `(admin)`
- Layouts: `PublicLayout`, `AuthLayout`, `AppLayout`, `AdminLayout`
- Páginas placeholder: `/`, `/events`, `/login`, `/register`, `/dashboard`, `/account`, `/admin`
- Camada `src/lib/api`: `client`, `errors`, `endpoints`, `query-client`
- Stub `src/lib/auth/token`
- `.env.example` com `NEXT_PUBLIC_API_URL=http://localhost:3000`

## Fora de escopo

- Chamadas reais à API em páginas ou componentes
- Autenticação funcional (login/register forms)
- Listagem de eventos, checkout, reservas de arena
- Pagamento de reserva de arena e recorrência
- Módulo `search` separado (`GET /events?q=` será usado na sprint de eventos)
- Painel admin com CRUD de categorias
- `PATCH /users/me`, `GET /arenas` (listagem global)

## Arquivos criados (principais)

```
web/
  package.json, components.json, prettier.config.mjs
  .env.example
  src/app/layout.tsx
  src/app/(public)/...
  src/app/(auth)/...
  src/app/(app)/...
  src/app/(admin)/admin/...
  src/components/layout/*
  src/components/ui/button.tsx
  src/components/feedback/placeholder-message.tsx
  src/lib/api/*
  src/lib/auth/token.ts
  src/lib/utils.ts
  src/providers/*
  src/styles/globals.css
  src/features/README.md
  src/features/auth/api.ts (stub)
  src/features/events/api.ts (stub)
```

## Decisões técnicas

| Decisão                                   | Motivo                                           |
| ----------------------------------------- | ------------------------------------------------ |
| `fetch` apenas em `lib/api/client.ts`     | Regra de arquitetura; features expõem `api.ts`   |
| `endpoints.ts` espelha o mapa de contrato | Evitar URLs inventadas                           |
| Busca = `GET /events` com `q`             | Não há `/search` no backend                      |
| `NEXT_PUBLIC_API_URL` → porta **3000**    | Alinhado a `/api/.env` (`PORT=3000`)             |
| Next na 3000 em dev                       | Documentado uso de `-p 3001` se conflito com API |
| Route groups sem alterar URL              | `(public)/page.tsx` → `/`                        |
| Register placeholder mantido              | `POST /auth/register` existe no backend          |
| Admin placeholder sem guard               | Proteção por role na sprint de auth              |

## Critérios de aceite

- [x] `pnpm dev` sobe o projeto
- [x] `pnpm build` conclui sem erro
- [x] `pnpm lint` passa
- [x] Home `/` renderiza com layout público
- [x] Placeholders: `/events`, `/login`, `/register`, `/dashboard`, `/account`, `/admin`
- [x] Estrutura `src/features` documentada
- [x] Nenhum `fetch` em páginas/componentes
- [x] Nenhum arquivo em `/api` alterado

## Próximos passos (Sprint 01 sugerida)

1. Feature `auth`: formulários login/register → `features/auth/api.ts`
2. Persistência de token + redirect para `/dashboard`
3. Feature `events`: listagem pública com TanStack Query (`GET /events`)
4. Página de detalhe `GET /events/:id`
5. Guard de rotas `(app)` e `(admin)` por role
