# Sprint 01 — Autenticação, sessão e guards

## Objetivo

Implementar login, cadastro, persistência de JWT, leitura do usuário autenticado (`GET /users/me`) e proteção de rotas por sessão e role admin.

## Escopo

- Helpers de token (`getToken`, `setToken`, `removeToken`, `hasToken`)
- Cliente HTTP com Bearer automático e tratamento de 401
- Feature `auth`: types, schemas Zod, api, hooks, componentes de formulário e guards
- Páginas funcionais: `/login`, `/register`, `/dashboard`, `/account`, `/admin` (protegida)
- Redirecionamentos de sessão (guest / autenticado)
- Mensagens de erro em português

## Fora de escopo

- Listagem e detalhe de eventos
- Bookings, payments, notifications
- Edição de perfil (`PATCH /users/me` inexistente)
- Pagamento de reserva de arena e recorrência
- Módulo `/search` dedicado
- CRUD admin de categorias
- Recuperação de senha, MFA, auth social

## Endpoints usados

| Método | Rota             | Uso                                  |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/auth/login`    | Login → JWT                          |
| POST   | `/auth/register` | Cadastro (sem token; redirect login) |
| GET    | `/users/me`      | Sessão e dados da conta              |

## Arquivos criados / alterados (principais)

```
src/lib/auth/token.ts
src/lib/api/client.ts
src/lib/api/error-messages.ts
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/feedback/loading-state.tsx
src/components/feedback/access-denied.tsx
src/features/auth/types.ts
src/features/auth/schemas.ts
src/features/auth/keys.ts
src/features/auth/api.ts
src/features/auth/hooks.ts
src/features/auth/components/*
src/app/(auth)/*
src/app/(app)/*
src/app/(admin)/*
src/components/layout/app-layout.tsx
src/components/layout/admin-layout.tsx
```

## Decisões técnicas

| Decisão                                           | Motivo                                                        |
| ------------------------------------------------- | ------------------------------------------------------------- |
| JWT em `localStorage`                             | MVP simples; migrar para cookie httpOnly depois se necessário |
| `token: null` em login/register                   | Evita anexar Bearer em rotas públicas                         |
| 401 com token → `removeToken` + redirect `/login` | Contrato da sprint                                            |
| Cadastro → `/login?registered=1`                  | `POST /auth/register` não retorna JWT                         |
| `AuthGuestGuard` no layout `(auth)`               | Evita login duplicado com sessão válida                       |
| `AdminGuard` exibe acesso negado                  | Não redireciona silenciosamente                               |
| `useMe` com `enabled: hasToken()`                 | Evita chamadas desnecessárias                                 |

## Critérios de aceite

- [x] `pnpm build` e `pnpm lint` passam
- [x] Login via `POST /auth/login`
- [x] Cadastro via `POST /auth/register`
- [x] Token salvo após login
- [x] `GET /users/me` na área logada
- [x] Logout limpa token e redireciona
- [x] `/dashboard` e `/account` exigem autenticação
- [x] `/admin` exige role `admin`
- [x] `fetch` apenas em `lib/api/client.ts`
- [x] Nenhum arquivo em `/api` alterado

## Próximos passos (Sprint 02 sugerida)

1. Feature `events`: listagem pública `GET /events` com TanStack Query
2. Detalhe `GET /events/:id`
3. Filtros/busca via query `q` (sem módulo search)
4. Cache e estados de loading/erro nas páginas públicas
