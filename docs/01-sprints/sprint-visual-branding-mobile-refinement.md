# Sprint — Refinamento visual, marca e mobile

## Objetivo

Aplicar a identidade visual oficial do Spolê (logo e paleta), padronizar o design system, corrigir navegação mobile com menu sanduíche e refinar UX/UI das telas principais — **sem** novas features de produto ou alterações no backend.

## Escopo

- Logo oficial `/public/logo_h.png` via componente `BrandLogo`
- Tokens de cor: `#606062`, `#ff6600`, `#fc9101`
- `SiteHeader` + `MobileNav` (drawer) em layouts público, app e admin
- Revisão de Button, Input, Badge, cards e feedback
- Status badges de booking, payment e reservation
- Home, catálogo e superfícies de conta/checkout com hierarquia visual melhor
- Favicon referenciando a logo
- `overflow-x-hidden` global

## Fora de escopo

- Integrações novas de API, CRUD, Admin completo, recorrência, gateway, webhook no browser
- Refatoração de domínio ou rotas
- Alterações em `/api`

## Identidade visual

| Cor       | Uso                                         |
| --------- | ------------------------------------------- |
| `#606062` | Texto secundário, neutros, labels           |
| `#ff6600` | Primary — CTAs, links, focus ring, destaque |
| `#fc9101` | Hover de botão primário, badge accent       |

Sensação buscada: modernidade, energia, clareza e organização — laranja como destaque, não como fundo dominante.

## Logo

- Componente: `src/components/brand/brand-logo.tsx`
- Tamanhos: `compact` (header), `default`, `large` (auth/home)
- `next/image` com `object-contain` — sem distorção
- Texto manual “Spolê” removido dos headers

## Navegação mobile

- `md:` breakpoint: navegação horizontal no desktop
- Botão sanduíche (`Menu` / `X`) abre painel lateral
- Overlay, fechamento por Escape e clique fora
- `body` com scroll bloqueado quando aberto
- Links com estado ativo (`aria-current`)
- Área de toque mínima ~44px (`min-h-11`)

## Componentes revisados

- `Button`, `Input`, `Badge` (novo)
- `SiteHeader`, `MobileNav`, `NavLink`
- `EmptyState`, `ErrorState`, `PlaceholderMessage`
- `PaymentStatusBadge`, `BookingStatusBadge`, `ReservationStatusBadge`
- `EventCard`, `EventPriceBadge`

## Telas revisadas

Públicas: `/`, `/events`, detalhe de evento, arenas e slots.  
Autenticadas: dashboard, conta, bookings, payments, notifications, reservations, checkout.  
Admin: layout com badge e header unificado.

## Arquivos principais

| Arquivo                                 | Alteração                     |
| --------------------------------------- | ----------------------------- |
| `src/styles/globals.css`                | Paleta e utilitários de marca |
| `src/components/brand/brand-logo.tsx`   | **Novo**                      |
| `src/components/layout/site-header.tsx` | **Novo**                      |
| `src/components/layout/mobile-nav.tsx`  | **Novo**                      |
| `src/components/layout/nav-link.tsx`    | **Novo**                      |
| `src/components/ui/badge.tsx`           | **Novo**                      |
| `src/components/layout/*-layout.tsx`    | Headers unificados            |
| `src/lib/brand/colors.ts`               | **Novo**                      |

## Critérios de aceite

- [x] Logo oficial no header, auth e home
- [x] Paleta aplicada em tokens CSS e componentes
- [x] Menu sanduíche no mobile
- [x] Header responsivo sem overflow horizontal
- [x] `pnpm lint` e `pnpm build`
- [x] Nenhum arquivo em `/api`
- [x] Fluxos existentes preservados

## Próximos passos

- Versão da logo com fundo transparente (opcional) para header claro
- Dark mode refinado com a paleta laranja
- Componentes Sheet/Dialog shadcn se o projeto expandir o UI kit
