# Spolê — Documentação do Frontend (`/web`)

Documentação do projeto web do Spolê. O backend vive em `/api`; esta pasta concentra decisões, sprints e contratos **do lado do cliente**.

## Estrutura

| Pasta                            | Conteúdo                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------- |
| [`00-product/`](./00-product/)   | Visão do produto web, stack, princípios de arquitetura e integração com a API |
| [`01-sprints/`](./01-sprints/)   | Planejamento de sprints do frontend (sempre **1 sprint atrás** do backend)    |
| [`02-features/`](./02-features/) | Especificações por feature e mapas de integração                              |
| [`03-prompts/`](./03-prompts/)   | Templates de prompts para implementação e análise no Cursor                   |

## Documentos principais

- [Visão do frontend](./00-product/frontend-overview.md)
- [Mapa de contrato da API](./02-features/api-contract-map.md) — fonte de verdade para integração frontend ↔ backend

## Regras de trabalho

1. **Não alterar** arquivos em `/api` sem autorização explícita.
2. **Não inventar endpoints** — usar apenas o que está em `api-contract-map.md` (derivado do código em `/api`).
3. Toda chamada HTTP passa por uma **camada centralizada** de API no frontend; componentes não usam `fetch`/`axios` diretamente.
4. Organização por **features** no código do `/web` (a ser criado nas próximas tarefas).
5. Pagamento de reserva de arena e recorrência: tratar como **pendente / instável** até validação conjunta com o backend.

## Referência cruzada

- Backend: `/api/docs/`
- Padrões REST: `/api/docs/00-product/api-standards.md`
