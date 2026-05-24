# 01 — Sprints (frontend)

## Regra de sincronia

O frontend **caminha 1 sprint atrás** do backend:

| Backend (`/api/docs/01-sprints/`) | Frontend (`/web/docs/01-sprints/`)                                      |
| --------------------------------- | ----------------------------------------------------------------------- |
| Sprint atual em desenvolvimento   | Implementa o recorte **estável** da sprint anterior                     |
| Endpoints novos ou em fluxo       | Documentar em `02-features/api-contract-map.md`; UI só após estabilizar |

**Estado atual (maio/2026):** frontend com Sprints **00–16** (MVP web: participante, organizador, admin, dono de arena, QA operacional, catálogo público de arenas e operação do evento do organizador). **Recorrência**, gateway real e features fora do contrato permanecem bloqueadas até a API expor rotas.

## Como usar esta pasta

Cada arquivo `sprint-XX.md` (a criar) deve conter:

1. Objetivo alinhado ao recorte backend **N−1**
2. Features/telas entregues
3. Endpoints consumidos (link para o mapa de contrato)
4. Critérios de aceite e testes manuais
5. Dependências e bloqueios

## Referência

- Sprints do backend: `/api/docs/01-sprints/`
- Contrato HTTP: [`../02-features/api-contract-map.md`](../02-features/api-contract-map.md)
