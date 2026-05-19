# Spolê — Visão do Frontend

## 1. Papel do `/web`

Cliente web do Spolê, consumindo a API REST em `/api`. O frontend é **feature-based**, com camada única de acesso à API e estado de servidor via TanStack Query.

## 2. Stack planejada (não implementada ainda)

| Camada        | Tecnologia                                   |
| ------------- | -------------------------------------------- |
| Framework     | Next.js (App Router)                         |
| Linguagem     | TypeScript                                   |
| Estilo        | Tailwind CSS                                 |
| Componentes   | shadcn/ui                                    |
| Dados remotos | TanStack Query                               |
| API           | Cliente centralizado (wrapper sobre `fetch`) |

## 3. Princípios de arquitetura

1. **Features primeiro** — `src/features/<domínio>/` com componentes, hooks e tipos locais.
2. **API isolada** — `src/lib/api/` (ou equivalente) com client, interceptors de auth e funções por módulo; **proibido** `fetch`/`axios` em componentes.
3. **Contrato explícito** — tipos e endpoints alinhados a [`../02-features/api-contract-map.md`](../02-features/api-contract-map.md).
4. **Sprints defasadas** — o frontend implementa a sprint **N−1** em relação ao backend (ex.: backend na sprint 10 → frontend foca entregas equivalentes à sprint 9).
5. **Sem antecipar backend** — não construir telas para rotas inexistentes.

## 4. Perfis e áreas da UI (planejamento)

| Perfil        | Áreas principais                                                                   |
| ------------- | ---------------------------------------------------------------------------------- |
| Participante  | Descoberta, detalhe do evento, inscrição gratuita, compra paga, conta              |
| Organizador   | Criar/editar eventos, reservar arena, minhas reservas                              |
| Dono de arena | Cadastro de arena, espaços, slots, reservas recebidas                              |
| Admin         | Categorias (quando houver painel); demais rotas admin ainda **não existem** na API |

## 5. Integração com a API

- Base URL configurável (`NEXT_PUBLIC_API_URL`).
- Autenticação: header `Authorization: Bearer <token>` após login.
- Envelope de resposta: `{ success, data, meta? }` / `{ success: false, error }` — ver mapa de contrato.

## 6. Escopo pendente / instável (não priorizar UI completa)

- Pagamento de **reserva de arena** (`POST /reservations/:id/payments`, ocorrências recorrentes).
- **Recorrência semanal** de reservas e liberação automática por inadimplência.
- Gateway real (hoje: `mock-provider` + PIX simulado).
- Módulo **admin** dedicado na API.
- Atualização de perfil (`PATCH /users/me`) — **não implementado** no backend.

## 7. Próximos passos (fora desta entrega)

1. Bootstrap do projeto Next.js em `/web`.
2. Cliente HTTP + providers (Query, auth).
3. Primeira sprint frontend alinhada a `01-sprints/`.
